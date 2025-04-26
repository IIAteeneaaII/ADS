const habitRepo = require('../repositories/habitRepositoryPrisma');

exports.createCustomHabit = async (req, res) => {
  const userId = req.user.id;

  const {
    name,
    description,
    frequency,
    reminderTime,
    startDate
  } = req.body;

  try {
    const newHabit = await habitRepo.createUserHabit({
      userId,
      name,
      description,
      frequency,
      reminderTime,
      startDate: new Date(startDate),
      isActive: true,
      habitTemplateId: null
    });

    res.status(201).json({ message: 'Custom habit created', habit: newHabit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating custom habit' });
  }
};
