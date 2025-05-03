const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // o el SMTP que uses (Gmail, Outlook, tu empresa, etc.)
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendRecoveryEmail(to, token) {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`; // cambia localhost si es necesario

  await transporter.sendMail({
    from: '"Tu App de Hábitos" <no-reply@tuapp.com>', // Cambia el nombre
    to,
    subject: 'Recuperación de contraseña',
    html: `
      <h1>Recuperar contraseña</h1>
      <p>Haz click en el siguiente enlace para resetear tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `,
  });
}

module.exports = { sendRecoveryEmail };
