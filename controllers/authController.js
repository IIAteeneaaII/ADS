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
