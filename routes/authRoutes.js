const express = require('express');
const router = express.Router();
const { register, login, recoverPassword, validateResetToken, resetPassword } = require('../controllers/authController');

const { validateRegister, validateLogin } = require('../middlewares/validateAuth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
// router.get('/logout', logout);
router.post('/recover-password', recoverPassword);
router.post('/validate-reset-token', validateResetToken);
router.post('/reset-password', resetPassword);

module.exports = router;
