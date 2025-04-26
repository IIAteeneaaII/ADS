const express = require('express');
const router = express.Router();
const { createCustomHabit  } = require('../controllers/habitController');
const { validateCreateHabit } = require('../middlewares/validateCreateHabit')

router.post('/custom/', validateCreateHabit, createCustomHabit);

module.exports = router;
