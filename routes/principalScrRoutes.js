const express = require('express');
const router = express.Router();
const { getHabitsForDate, getAllHabits, generateDailyHabitLog, UpdateLog, getCompletedHabitsWithFieldValues  } = require('../controllers/habitController');

router.get('/principalScr', getHabitsForDate);
router.get('/all', getAllHabits);
router.post('/actualizarLogs',UpdateLog);
router.get('/completed/details', getCompletedHabitsWithFieldValues);


module.exports = router;