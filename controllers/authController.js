const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepositoryPrisma');
const { setFlashMessage } = require('../utils/flashMessage');
const redis = require('../redisClient');
const { sendRecoveryEmail } = require('../emailSender');
const { createOrUpdateJob } = require('../utils/jobManager');

exports.register = async (req, res) => {
  const { email, password, userName } = req.body;

  try {
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
    setFlashMessage(res, '¡Inicio de sesión éxitoso.', 'success');
    res.redirect('/Preferencias');
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

  const token = uuidv4();
  await redis.setEx(`reset-token:${token}`, 3600, email);
  await sendRecoveryEmail(email, token);

  res.status(200).json({ message: 'Recovery link sent' });
};

exports.validateResetToken = async (req, res) => {
  const { token } = req.query;

  const email = await redis.get(`reset-token:${token}`);
  if (!email) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  res.status(200).json({ message: 'Token is valid', email });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const email = await redis.get(`reset-token:${token}`);
  if (!email) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  try {
    await userRepo.updatePassword(email, hashedPassword);  // Llama al método de actualización
    await redis.del(`reset-token:${token}`);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
