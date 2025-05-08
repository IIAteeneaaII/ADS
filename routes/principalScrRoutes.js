const express = require('express');
const router = express.Router();
const { getHabitsForDate, getAllHabits } = require('../controllers/habitController');

router.get('/principalScr', getHabitsForDate);
router.get('/all', getAllHabits);

module.exports = router;