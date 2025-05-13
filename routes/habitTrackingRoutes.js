const express = require('express');
const router = express.Router();
const { getWeeklyHabitDurations, getMonthlyHabitDurations } = require('../repository/habitTrackingRepository');

// GET /api/habits/duration/weekly?userId=1
router.get('/duration/weekly', async (req, res) => {
  const userId = parseInt(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const data = await getWeeklyHabitDurations(userId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching weekly durations' });
  }
});

// GET /api/habits/duration/monthly?userId=1
router.get('/duration/monthly', async (req, res) => {
  const userId = parseInt(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const data = await getMonthlyHabitDurations(userId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching monthly durations' });
  }
});

module.exports = router;
