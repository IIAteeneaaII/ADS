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

exports.getAllHabits = async (req, res) => {
  const userId = req.user.id;

  try {
    const habits = await habitRepo.getAllUserHabits(userId);
    res.json(habits);
  } catch (error) {
    console.error("Error fetching all habits:", error);
    res.status(500).json({ message: 'Error getting all habits' });
  }
};

exports.generateDailyHabitLog = async (req, res) => {
  const date = new Date();
  date.setHours(1, 0, 0, 0);

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = days[date.getDay()];

  try {
    const habits = await habitRepo.getAllUsersHabits(date, dayName);
    
    const logs = habits.map(habit => ({
      userHabitId: habit.id,
      date: date,
      status: 'pending',
      notes: '',
      fieldValues: habit.fieldValues
    }));
    try{
      await habitRepo.UploadHabits(logs, true);
      console.log(`${logs.length} logs creados para el día ${dayName}`);
      res.status(200).json({ message: 'Logs generados correctamente' });
    }catch(error){
      console.error("Error al subir los hábitos:", error);
      res.status(500).json({ message: 'Error subiendo los hábitos' });
    }
    
  } catch (error) {
    console.error("Error al conseguir los hábitos:", error);
    res.status(500).json({ message: 'Error cargando los hábitos' });
  }
};