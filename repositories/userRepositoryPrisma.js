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

exports.findValidResetCode = async (code) => {
  return await prisma.resetCode.findFirst({
    where: {
      code,
      expiresAt: {
        gte: new Date(), // Código aún no expirado
      },
    },
  });
};

exports.deleteResetCodeById = async (id) => {
  return await prisma.resetCode.delete({
    where: { id },
  });
};
