const express = require('express');
const router = express.Router();
const { register, login, logout, recoverPassword, validateResetToken, resetPassword, deleteAccount, updateProfile  } = require('../controllers/authController');
const { upload } = require('../utils/cloudinary');
const { authMiddleware } = require('../middlewares/authMiddleware'); 
const { validateRegister, validateLogin, validateDeleteAcc } = require('../middlewares/validateAuth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/deleteAcc', validateDeleteAcc, deleteAccount);
router.get('/logout', logout);
router.post('/recover-password', recoverPassword);
router.post('/validate-reset-token', validateResetToken);
router.post('/reset-password', resetPassword);
router.put('/user/profile', authMiddleware, upload.single('profilePic'), updateProfile);
  


module.exports = router;
