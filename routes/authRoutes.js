const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

const { validateRegister, validateLogin } = require('../middlewares/validateAuth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Ruta para recuperar la contraseña
// router.post('/recover-password', recoverPassword);  // Nueva ruta para la recuperación de contraseña

module.exports = router;
