const habitRepo = require('../repositories/habitRepositoryPrisma');
const { setFlashMessage } = require('../utils/flashMessage');

exports.createCustomHabit = async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    description,
    frequency,
    startDate,
    icon = "yes",
    reminder = true
  } = req.body;
  console.log(frequency)
  try {
    const newHabit = await habitRepo.createUserHabit({
      userId,
      name,
      description,
      frequency,
      icon,
      reminder: reminder === "yes",
      startDate: new Date(startDate),
      isActive: true,
      habitTemplateId: null
    });

    setFlashMessage(res, 'Se ha creado tu habito personalizado', 'success');

    res.redirect('/inicio')
  } catch (error) {
    console.error(error);
    setFlashMessage(res, 'Hubo un error en el servidor. Intenta más tarde', 'error');
    res.redirect('/')
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
