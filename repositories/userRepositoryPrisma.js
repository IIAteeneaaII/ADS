const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

exports.createUser = async (user) => {
  return await prisma.user.create({
    data: user,
  });
};

exports.updatePassword = async (email, hashedPassword) => {
  try {
    // Actualiza la contraseña del usuario en la base de datos
    const updatedUser = await prisma.user.update({
      where: {
        email: email,  // Busca el usuario por su correo electrónico
      },
      data: {
        password: hashedPassword,  // Establece la nueva contraseña
      },
    });
    return updatedUser;  // Devuelve el usuario actualizado (opcional)
  } catch (error) {
    throw new Error('Error updating password: ' + error.message);
  }
};

exports.getAll = async () => {
  return await prisma.user.findMany();
};

exports.deleteUserByEmail = async (email) => {
  return await prisma.user.delete({
    where: { email },
  });
};

exports.updateUserProfile = async (userId, data) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data
    });
    return updatedUser;
  } catch (error) {
    throw new Error('Error updating profile: ' + error.message);
  }
};

exports.createResetCode = async (email, code) => {
  return await prisma.resetCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // expira en 10 minutos
    }
  });
};


exports.emailCodeExist = async (email) => {
  return await prisma.resetCode.findMany({
    where: { email },
  });
};

exports.findValidResetCode = async (code) => {
  return await prisma.resetCode.findFirst({
    where: {
      code,
      expiresAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc', // Busca el más reciente en caso de duplicados
    },
  });
};

exports.deleteResetCodeById = async (id) => {
  return await prisma.resetCode.delete({
    where: { id },
  });
};

exports.deleteResetCodesByEmail = async (email) => {
  return await prisma.resetCode.deleteMany({
    where: { email },
  });
};

exports.invalidateResetCodesByEmail = async (email) => {
  return await prisma.resetCode.updateMany({
    where: {
      email,
      expiresAt: {
        gte: new Date(), // Solo los que aún no expiraron
      },
    },
    data: {
      expiresAt: new Date(), // Los haces expirar ahora
    },
  });
};

exports.saveMood = async ({ userId, date, mood, isUpdate = false }) => {
  try {
    const parsedDate = new Date(date); // Asegura formato Date correcto

    if (isUpdate) {
      return await prisma.mood.update({
        where: {
          userId_date: {
            userId: userId,
            date: parsedDate
          }
        },
        data: {
          mood, 
        }
      });
    } else {
      return await prisma.mood.create({
        data: {
          userId,
          mood, 
          date: parsedDate,
        }
      });
    }
  } catch (error) {
    console.error('Error en la operación de estado de ánimo:', error);
    throw error;
  }
};

function truncateDateToUTC(dateInput) {
  const date = new Date(dateInput);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

exports.findMoodByUserAndDate = async (userId, date) => {
  const normalizedDate = truncateDateToUTC(date);
  console.log("Buscando mood de usuario", userId, "para la fecha:", normalizedDate.toISOString());

  return await prisma.mood.findUnique({
    where: {
      userId_date: {
        userId: userId,
        date: normalizedDate,
      }
    }
  });
};

exports.getMoodsByUser = async (userId) => {
  return await prisma.mood.findMany({
    where: { userId },
    select: {
      date: true,
      mood: true,
    },
  });
};
