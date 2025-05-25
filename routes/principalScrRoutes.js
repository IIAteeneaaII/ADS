const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getHabitsForDate, getAllHabits, generateDailyHabitLog, UpdateLog, getHabitLogsById, getActiveHabitNames, getHabitsUnitsController, getUniqueTrackingDates } = require('../controllers/habitController');
router.get('/principalScr', getHabitsForDate);
router.get('/all', getAllHabits);
router.post('/actualizarLogs',UpdateLog);
router.get('/activeHabits', getActiveHabitNames);
router.get('/:habitId', authMiddleware, getHabitLogsById);
router.get('/units/:habitId', getHabitsUnitsController);
router.get('/logs/unique-dates', getUniqueTrackingDates);

module.exports = router;