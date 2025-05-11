const express = require('express');
const router = express.Router();
const {generateDailyHabitLog } = require('../controllers/habitController');

//solo pruebas, no se usan en la app
router.post('/generateTodayHabits', generateDailyHabitLog);

module.exports = router;