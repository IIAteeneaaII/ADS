const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepositoryPrisma');

exports.register = async (req, res) => {
  const { email, password, userName } = req.body;

  try {
    const exists = await userRepo.findByEmail(email);
    if (exists){
      res.cookie('flashMessage', 'El usuario ya existe', { maxAge: 2000 });
      res.cookie('flashType', 'error', { maxAge: 2000 });
      return res.redirect('/Registro');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepo.createUser({
      email,
      password: hashedPassword,
      userName,
    });

    res.cookie('flashMessage', '¡Registro exitoso! Ya puedes iniciar sesión.', { httpOnly: false });
res.cookie('flashType', 'success', { httpOnly: false });
res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/Registro?error=Hubo un error en el servidor. Intenta más tarde');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)

  try {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.redirect('/?error=Correo o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect('/?error=Correo o contraseña incorrectos');
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

    res.redirect('/Preferencias');
  } catch (err) {
    console.error(err);
    res.redirect('/?error=Hubo un error en el servidor. Intenta más tarde');
  }
};

exports.recoverPassword = async (req, res) => {
  const { email } = req.body;

  const user = userRepo.findByEmail(email);
  if (!user) return res.status(404).json({ message: 'Email not found' });

  const token = uuidv4();
  await redis.setEx(`reset-token:${token}`, 3600, email);
  console.log('Enlace para reset: http://localhost:3000/reset-password?token=${token}');

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

  const user = userRepo.findByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await redis.del(`reset-token:${token}`);

  res.status(200).json({ message: 'Password updated successfully' });
};

exports.logout = async (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};