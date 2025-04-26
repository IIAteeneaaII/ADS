const express = require('express');
const router = express.Router();
const { getHabitsForDate } = require('../controllers/habitController');

router.get('/principalScr', getHabitsForDate);

module.exports = router;