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
    include: {
      logs: {
        where: {
          userHabitId: {
            equals: prisma.userHabit.id,
          },
          date: date,
        },
        take: 1,
      },
    },
  });

  const habitsWithLog = habits.map(habit => {
    if (habit.logs && habit.logs.length > 0) {
      habit.logs = habit.logs[0];
    }
    return habit;
  });

  console.log(habitsWithLog);

  return habitsWithLog;
};




exports.getAllUserHabits = async (userId) => {
  return await prisma.userHabit.findMany({
    where: {
      userId: userId,
      isActive: true,
    },
  });
};


exports.getAllUsersHabits = async (date, dayName) => {
  return await prisma.userHabit.findMany({
    where: {
      isActive: true,
      startDate: { lte: date },
      AND: [
        {
          frequency: {
            path: ['type'],
            equals: 'weekly'
          }
        },
        {
          frequency: {
            path: ['days'],
            array_contains: dayName
          }
        }
      ]
    }
  });
};


exports.UploadHabits = async (logs, skipDuplicates) => {
  return prisma.habitTrackingLog.createMany({
    data: logs,
    skipDuplicates: skipDuplicates
  });
};

exports.UpdateStatus = async ({ userHabitId, date, status }) => {
  const logExistente = await prisma.habitTrackingLog.findUnique({
    where: {
      userHabitId_date: {
        userHabitId,
        date
      }
    }
  });

  let log;

  if (logExistente) {
    log = await prisma.habitTrackingLog.update({
      where: {
        userHabitId_date: {
          userHabitId,
          date
        }
      },
      data: {
        status
      }
    });
  } else {
    const habito = await prisma.userHabit.findUnique({
    where: {
        id:userHabitId,
    }
  });
    log = await prisma.habitTrackingLog.create({
      data: {
        userHabitId,
        date,
        status,
        fieldValues: habito.fieldValues
      }
    });
  }

  return log;
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


exports.getRecentNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });
};


exports.countUnreadNotifications = async (userId) => {
  const unreadCount = await prisma.notification.count({
    where: {
      userId: userId,
      isRead: false,
    },
  });

  return unreadCount;
};

exports.markAllAsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: {
      userId: userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};
