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
    const normalizedName = name.trim().toLowerCase();
    const existingHabit = await habitRepo.findUserHabitByName(userId, normalizedName);
    if (existingHabit) {
      // setFlashMessage(res, 'Ya tienes un hábito registrado con ese nombre', 'error');
      return res.status(400).json({ message: 'Ya tienes un hábito registrado con ese nombre.' });
    }

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
  date.setHours(1, 0, 0, 0);

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = daysOfWeek[date.getDay()];

  console.log("prueba", { userId, date, dayName });

  try {
    const habits = await habitRepo.getUserHabitsWithLog(userId, date, dayName);
    console.log("Hábitos obtenidos:", habits);
    res.json(habits);
  } catch (error) {
    console.error("ERROR pr", error);
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
exports.getActiveHabitNames = async (req, res) => {
  const userId = req.user.id;

  try {
    const habits = await habitRepo.getAllUserHabits(userId); // Ya lo usas en getAllHabits
    const activeNames = habits
      .filter(h => h.isActive)
      .map(h => h.name.trim().toLowerCase());

    res.json(activeNames);
  } catch (error) {
    console.error('Error al obtener nombres de hábitos activos:', error);
    res.status(500).json({ message: 'Error al obtener nombres de hábitos activos' });
  }
};

exports.generateDailyHabitLog = async (req, res) => {
  const date = new Date();
  date.setHours(1, 0, 0, 0);

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = days[date.getDay()];

  console.log("Generando logs para el día:", dayName);

  try {
    const habits = await habitRepo.getAllUsersHabits(date, dayName);
    console.log("Hábitos obtenidos:", habits);

    const logs = habits.map(habit => ({
      userHabitId: habit.id,
      date: date,
      status: 'pending',
      notes: '',
      fieldValues: habit.fieldValues
    }));

    console.log("Logs a insertar:", logs);

    try {
      await habitRepo.UploadHabits(logs, true);
      console.log(`${logs.length} logs creados para el día ${dayName}`);
      res.status(200).json({ message: 'Logs generados correctamente' });
    } catch (error) {
      console.error("Error al subir los hábitos:", error);
      res.status(500).json({ message: 'Error subiendo los hábitos' });
    }

  } catch (error) {
    console.error("Error al conseguir los hábitos:", error);
    res.status(500).json({ message: 'Error cargando los hábitos' });
  }
};

exports.UpdateLog = async (req, res) => {
  const userId = req.user.id;
  const { userHabitId, date, status } = req.body;

  if (!userHabitId || !status) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  const today = new Date();
  today.setHours(1, 0, 0, 0);

  try {
    const updatedLog = await habitRepo.UpdateStatus({
      userHabitId,
      date: today,
      status: status
    });

    return res.status(200).json({ message: 'Estado actualizado', log: updatedLog });
  } catch (error) {
    console.error('Error actualizando log:', error);
    return res.status(500).json({ error: 'Error al actualizar el estado del hábito.' });
  }
};

exports.updateHabit = async (req, res) => {
  const userId = req.user.id;
  const habitId = parseInt(req.params.id);
  const updates = req.body;

  try {
    const updated = await habitRepo.updateUserHabit(userId, habitId, updates);
    res.json({ message: 'Hábito actualizado', habit: updated });
  } catch (error) {
    console.error("Error al actualizar hábito:", error);
    res.status(500).json({ message: 'Error al actualizar hábito' });
  }
};

exports.deleteHabit = async (req, res) => {
  const userId = req.user.id;
  const habitId = parseInt(req.params.id);

  try {
    await habitRepo.deleteUserHabit(userId, habitId);
    res.json({ message: 'Hábito eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar hábito:", error);
    res.status(500).json({ message: 'Error al eliminar hábito' });
  }
};

exports.getHabitLogsById = async (req, res) => {
  const habitId = Number(req.params.habitId);
  const userId = req.user.id; // Para asegurarte que el usuario sea dueño

  try {
    // Verifica que ese hábito pertenece al usuario
    const habit = await habitRepo.getUserHabitById(habitId);
    if (!habit || habit.userId !== userId) {
      return res.status(404).json({ message: 'Hábito no encontrado o no autorizado' });
    }

    const logs = await habitRepo.getHabitsLogsByHabitId(habitId);

    res.json({ logs, frequency: habit.frequency });
  } catch (error) {
    console.error('Error al obtener logs del hábito:', error);
    res.status(500).json({ message: 'Error al obtener logs del hábito' });
  }
};

exports.getHabitsUnitsController = async (req, res) => {
  const habitId = Number(req.params.habitId);

  try {
    const logs = await habitRepo.getHabitsUnit(habitId);

    res.json(logs);
  } catch (error) {
    console.error('Error al obtener las unidades:', error);
    res.status(500).json({ message: 'Error al obtener las unidades' });
  }
};

exports.getUniqueTrackingDates = async (req, res) => {
  const userId = req.user.id;

  try {
    const logs = await habitRepo.getUniqueTrackingDatesByUserId(userId);
    res.json(logs);
  } catch (error) {
    console.error('Error al obtener las fechas únicas de seguimiento:', error);
    res.status(500).json({ message: 'Error al obtener fechas de seguimiento' });
  }
};
