const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepositoryPrisma');
const { setFlashMessage } = require('../utils/flashMessage');
const redis = require('../redisClient');
const { sendRecoveryEmail, sendAuthEmail } = require('../emailSender');
const { createOrUpdateJob } = require('../utils/jobManager');
const { createResetCode } = userRepo;
const { findValidResetCode, deleteResetCodeById, saveMood, findMoodByUserAndDate, getMoodsByUser,emailCodeExist } = userRepo;

exports.register = async (req, res) => {
  const { email, password, userName, codigo } = req.body;

  try {
    const resetCode = await findValidResetCode(codigo);

    if (!resetCode || resetCode.email !== email) {
      setFlashMessage(res, 'Código Invalido o expirado', 'error');
      return res.redirect('/Registro');
    }

    const exists = await userRepo.findByEmail(email);
    if (exists){
      setFlashMessage(res, 'El usuario ya existe', 'error');
      return res.redirect('/Registro');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepo.createUser({
      email,
      password: hashedPassword,
      userName,
    });

    createOrUpdateJob(user.id, 'morning', 8);
    createOrUpdateJob(user.id, 'afternoon', 13);
    createOrUpdateJob(user.id, 'night', 21);

    setFlashMessage(res, '¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
    await userRepo.deleteResetCodesByEmail(email);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    setFlashMessage(res, 'Hubo un error en el servidor. Intenta más tarde', 'error');
    res.redirect('/Registro');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)

  try {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      setFlashMessage(res, 'Correo o contraseña incorrectos', 'error');
      res.redirect('/');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      setFlashMessage(res, 'Correo o contraseña incorrectos', 'error');
      res.redirect('/');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, userName: user.userName },
      'supersecret',
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000,
    });
    setFlashMessage(res, '¡Inicio de sesión éxitoso!.', 'success');
    res.redirect('/Bienvenida');
  } catch (err) {
    console.error(err);
    setFlashMessage(res, 'Hubo un error en el servidor. Intenta más tarde', 'error');
    res.redirect('/');
  }
};

exports.deleteAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepo.findByEmail(email);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    await userRepo.deleteUserByEmail(email);

    // Eliminar cookie del token
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,       // usa esto solo si estás en HTTPS
      sameSite: 'Strict'  // o 'Lax', según tu frontend
    });

    res.status(200).json({ msg: 'Account deleted successfully and cookie cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.recoverPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userRepo.findByEmail(email);
  if (!user) return res.status(404).json({ message: 'Email not found' });

  await userRepo.invalidateResetCodesByEmail(email);

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos

  await userRepo.createResetCode(email, code);
  await sendRecoveryEmail(email, code);

  res.status(200).json({ message: 'Código de verificación enviado' });
};

exports.authentification = async (req, res) => {
  const { email } = req.body;

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos

  console.log('Este es el email :' + email)

  const resultado = await emailCodeExist(email)
  if (resultado.length!=0) {
    await userRepo.deleteResetCodesByEmail(email);
  }

  await createResetCode(email, code);
  // Enviar el código por correo

  console.log('Codigo creado')


  await sendAuthEmail(email, code);

  res.status(200).json({ message: 'Código de verificación enviado' });
};

exports.validateResetCode = async (req, res) => {
  const { email, code } = req.body;

  const resetCode = await findValidResetCode(code);

  if (!resetCode || resetCode.email !== email) {
    return res.status(400).json({ message: 'Código Invalido o expirado' });
  }

  res.status(200).json({ message: 'Code is valid' });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Contraseñas no coinciden' });
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepo.updatePassword(user.email, hashedPassword);

  // Opcional: eliminar todos los códigos previos de ese email
  await userRepo.deleteResetCodesByEmail(user.email);

  res.status(200).json({ message: 'Contraseña Actualizada correctamente' });
};

exports.logout = async (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

exports.updateProfile = async (req, res) => {
  console.log('--- updateProfile START ---');
  const userId = req.user?.id;
  const { userName } = req.body;
  const profilePic = req.file?.path;

  if (!userId) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    const updatedUser = await userRepo.updateUserProfile(userId, {
      userName,
      ...(profilePic && { profilePic })
    });

    // Generar nuevo token con datos actualizados
    const newToken = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        userName: updatedUser.userName,
        profilePic: updatedUser.profilePic
      },
      'supersecret',
      { expiresIn: '1h' }
    );

    // Reemplazar cookie con nuevo token
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: false, // cámbialo a true si estás en HTTPS
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error en updateUserProfile:', err);
    return res.status(500).json({
      message: 'No se pudo actualizar el perfil',
      error: err.message
    });
  }
};

function truncateDateToUTC(dateInput) {
  const date = new Date(dateInput);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

exports.saveMood = async (req, res) => {
  try {
    const { mood, date } = req.body;
    const userId = req.user.id;

    if (!mood || !date) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    // 🔐 Normalizar la fecha a UTC sin hora
    const normalizedDate = truncateDateToUTC(date);

    // Buscar si ya existe un estado de ánimo para ese usuario y fecha
    const existingMood = await findMoodByUserAndDate(userId, normalizedDate);

    let result;
    if (existingMood) {
      // Si existe, actualizamos
      result = await saveMood({ userId, date: normalizedDate, mood, isUpdate: true });
      return res.status(200).json({ message: 'Estado de ánimo actualizado', mood: result });
    } else {
      // Si no existe, creamos uno nuevo
      result = await saveMood({ userId, date: normalizedDate, mood });
      return res.status(201).json({ message: 'Estado de ánimo guardado', mood: result });
    }

  } catch (error) {
    console.error('Error al guardar estado de ánimo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.renderCalendar = async (req, res) => {
  const userId = req.user.id;
  const moods = await getMoodsByUser(userId);

  const moodsByDate = moods.reduce((acc, mood) => {
    const utcDate = new Date(mood.date); // Ya está en UTC a medianoche
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    
    // Obtener solo la parte de fecha local YYYY-MM-DD
    const [{ value: year }, , { value: month }, , { value: day }] = formatter.formatToParts(utcDate);
    const localDateStr = `${year}-${month}-${day}`;

    acc[localDateStr] = mood.mood;
    return acc;
  }, {});

  res.render("calendario_emociones", { moodsByDate }); 
};
