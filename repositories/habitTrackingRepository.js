const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Obtiene los días del mes actual en los que un usuario completó un hábito.
 * @param {number} userId - ID del usuario.
 * @param {number} habitId - ID del hábito del usuario (UserHabit).
 * @returns {Promise<number[]>} - Array con los días del mes donde el hábito fue completado.
 */
async function getCompletedDaysOfCurrentMonth(userId, habitId) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const logs = await prisma.habitTrackingLog.findMany({
    where: {
      userHabitId: habitId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 'completed',
      userHabit: {
        userId: userId,
      }
    },
    select: {
      date: true,
    },
  });

  const days = logs.map(log => log.date.getDate());
  return [...new Set(days)].sort((a, b) => a - b); // días únicos ordenados
}

/**
 * Obtiene tiempo por día (en minutos) para cada hábito en los últimos 7 días.
 * @param {number} userId 
 * @returns {Promise<Object>} - Objeto con claves habitId y valores: array de objetos { date, duration }
 */
async function getWeeklyHabitDurations(userId) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6); // últimos 7 días incluyendo hoy

  const logs = await prisma.habitTrackingLog.findMany({
    where: {
      date: {
        gte: startDate,
        lte: today,
      },
      userHabit: {
        userId,
      },
    },
    select: {
      date: true,
      fieldValues: true,
      userHabitId: true,
    },
  });

  const result = {};

  logs.forEach(log => {
    const habitId = log.userHabitId;
    const dateStr = log.date.toISOString().split('T')[0]; // formato YYYY-MM-DD
    const duration = Number(log.fieldValues.duration || 0);

    if (!result[habitId]) result[habitId] = {};
    if (!result[habitId][dateStr]) result[habitId][dateStr] = 0;

    result[habitId][dateStr] += duration;
  });

  return result;
}

/**
 * Obtiene tiempo por día (en minutos) para cada hábito en los últimos 30 días.
 * @param {number} userId 
 * @returns {Promise<Object>} - Objeto con claves habitId y valores: array de objetos { date, duration }
 */
async function getMonthlyHabitDurations(userId) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 29); // últimos 30 días incluyendo hoy

  const logs = await prisma.habitTrackingLog.findMany({
    where: {
      date: {
        gte: startDate,
        lte: today,
      },
      userHabit: {
        userId,
      },
    },
    select: {
      date: true,
      fieldValues: true,
      userHabitId: true,
    },
  });

  const result = {};

  logs.forEach(log => {
    const habitId = log.userHabitId;
    const dateStr = log.date.toISOString().split('T')[0]; // formato YYYY-MM-DD
    const duration = Number(log.fieldValues.duration || 0);

    if (!result[habitId]) result[habitId] = {};
    if (!result[habitId][dateStr]) result[habitId][dateStr] = 0;

    result[habitId][dateStr] += duration;
  });

  return result;
}

module.exports = {
  getCompletedDaysOfCurrentMonth,
  getWeeklyHabitDurations,
  getMonthlyHabitDurations,
};
