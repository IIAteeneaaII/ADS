const express = require('express');
const router = express.Router();
const { getHabitsForDate, getAllHabits, generateDailyHabitLog, UpdateLog, getCompletedHabitsWithFieldValues, getActiveHabitNames  } = require('../controllers/habitController');

router.get('/principalScr', getHabitsForDate);
router.get('/all', getAllHabits);
router.post('/actualizarLogs',UpdateLog);
router.get('/completed/details', getCompletedHabitsWithFieldValues);
router.get('/activeHabits', getActiveHabitNames);



module.exports = router;