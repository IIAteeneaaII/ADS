const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepositoryMemory'); // ← cambiarás esto después por Mongo o DB

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const exists = userRepo.findByEmail(email);
  if (exists) return res.status(400).json({ msg: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  userRepo.createUser({ email, password: hashedPassword });

  res.status(201).json({ msg: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = userRepo.findByEmail(email);
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ email }, 'supersecret', { expiresIn: '1h' });

  res.json({ token });
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
