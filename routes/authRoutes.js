const express = require('express');
const router = express.Router();
const { register, login, deleteAccount } = require('../controllers/authController');

const { validateRegister, validateLogin, validateDeleteAcc} = require('../middlewares/validateAuth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/deleteAcc', validateDeleteAcc, deleteAccount);

module.exports = router;
