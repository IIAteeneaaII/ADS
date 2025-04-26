const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createUserHabit = async (data) => {
  return await prisma.userHabit.create({
    data
  });
};

exports.getUserHabitsWithLog = async (userId, date) => {
  return await prisma.userHabit.findMany({
    where: {
      userId: userId,
      isActive: true,
      startDate: {
        lte: date,
      },
      logs: {
        some: {
          date: date,
        },
      },
    },
    include: {
      logs: {
        where: {
          date: date,
        },
      },
    },
  });
};

exports.getDailyHabitCompletionPercentage = async (userId, date) => {
  const totalHabits = await prisma.userHabit.count({
    where: {
      userId: userId,
      isActive: true,
      startDate: {
        lte: date,
      },
    },
  });

  const completedHabits = await prisma.habitTrackingLog.count({
    where: {
      userHabit: {
        userId: userId,
      },
      date: date,
      status: "completed",
    },
  });

  const percentage = totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100;

  return {
    totalHabits,
    completedHabits,
    percentage: parseFloat(percentage.toFixed(2))
  };
};
