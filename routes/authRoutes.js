const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { recoverPassword } = require('../controllers/authController');
const { validateResetToken } = require('../controllers/authController');
const { resetPassword } = require('../controllers/authController');

const { validateRegister, validateLogin } = require('../middlewares/validateAuth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

router.post('/recover-password', recoverPassword);
router.post('/validate-reset-token', validateResetToken);
router.post('/reset-password', resetPassword);

module.exports = router;
