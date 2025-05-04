const habitRepo = require('../repositories/habitRepositoryPrisma');
const { setFlashMessage } = require('../utils/flashMessage');

exports.createCustomHabit = async (req, res) => {
  const userId = req.user.id;
  const { name, description, frequency, reminderTime, startDate } = req.body;

  if (!userId || !name || !frequency || !reminderTime || !startDate) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  if (frequency.type === 'weekly' && (!Array.isArray(frequency.days) || frequency.days.length === 0)) {
    return res.status(400).json({ message: 'Se requieren los días para frecuencia semanal' });
  }

  if (frequency.type === 'daily' && frequency.days) {
    return res.status(400).json({ message: 'La frecuencia diaria no debe tener días específicos' });
  }

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
