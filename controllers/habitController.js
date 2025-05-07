const habitRepo = require('../repositories/habitRepositoryPrisma');
const { setFlashMessage } = require('../utils/flashMessage');

exports.createCustomHabit = async (req, res) => {
  const userId = req.user.id;

  const {
    name,
    description,
    frequency,
    startDate,
    fieldValues, // ej {"unit": "min", "value": "30"}
    icon
  } = req.body;

  try {
    const newHabit = await habitRepo.createUserHabit({
      userId,
      name,
      description,
      frequency,
      icon,
      reminder: true,
      startDate: new Date(startDate),
      isActive: true,
      habitTemplateId: null,
      fieldValues
    });

    res.status(201).json({ message: 'Custom habit created', habit: newHabit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating custom habit' });
  }
};


exports.getHabitsForDate = async (req, res) => {
  const userId = req.user.id;
  const date = new Date(Date.now());
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = daysOfWeek[date.getDay()];

  console.log("prueba", { userId, date, dayName });

  try {
    const habits = await habitRepo.getUserHabitsWithLog(userId, date,dayName);
    res.json(habits);
  } catch (error) {
    console.error("ERROR pr",error);
    res.status(500).json({ message: 'Error getting habits' });
  }
};
