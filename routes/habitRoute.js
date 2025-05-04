const express = require('express');
const router = express.Router();
const { createCustomHabit  } = require('../controllers/habitController');
const { validateCreateHabit } = require('../middlewares/validateCreateHabit');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/personalizado', createCustomHabit);

module.exports = router;
