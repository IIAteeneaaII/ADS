const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createUserHabit = async (data) => {
  return await prisma.userHabit.create({
    data
  });
};

exports.getUserHabitsWithLog = async (userId, date, dayName) => {
  console.log({ userId, date, dayName });
  return await prisma.userHabit.findMany({
    where: {
      userId: userId,
      isActive: true,
      startDate: {
        lte: date,
      },
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
exports.findByToken = async (token) => {
  return await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gte: new Date(),
      },
    },
  });
};

exports.updatePassword = async (userId, hashedPassword) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
};
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
