const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createUserHabit = async (data) => {
  // console.log(data)
  return await prisma.userHabit.create({
    data
  });
};

exports.getUserHabitsWithLog = async (userId, date, dayName) => {
  console.log({ userId, date, dayName });
  const habits = await prisma.userHabit.findMany({
    where: {
      userId: userId,
      isActive: true,
      AND: [
        {
          frequency: {
            path: ['type'],
            equals: 'weekly',
          },
        },
        {
          frequency: {
            path: ['days'],
            array_contains: dayName,
          },
        },
      ],
    },
  });
  console.log(habits)

  return habits
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
