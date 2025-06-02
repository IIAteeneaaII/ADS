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

async function sendRecoveryEmail(to, code) {
  await transporter.sendMail({
    from: '"FIN IT" <no-reply@tuapp.com>',
    to,
    subject: '🔐 Recupera tu contraseña - Código de verificación FIN IT',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2e86de;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            color: white;
            margin: 0;
          }
          .content {
            padding: 25px;
            background-color: #f9f9f9;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e1e1e1;
          }
          .code-container {
            background-color: white;
            border: 2px dashed #2e86de;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 5px;
          }
          .code {
            font-size: 28px;
            letter-spacing: 3px;
            color: #2e86de;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FIN IT</h1>
        </div>
        
        <div class="content">
          <p>Hola,</p>
          <p>Recibimos una solicitud para <strong>restablecer tu contraseña</strong> en FIN IT. Usa el siguiente código para continuar con el proceso:</p>
          
          <div class="code-container">
            <div class="code">${code}</div>
          </div>
          
          <p>Este código es válido por <strong>10 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
          
          <p>Gracias por usar FIN IT.</p>
          <p>— El equipo de FIN IT</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} FIN IT. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `,
    text: `Recibimos una solicitud para restablecer tu contraseña.\nTu código de verificación para FIN IT es: ${code}\nEste código expirará en 10 minutos.\nSi no solicitaste este cambio, puedes ignorar este mensaje.`
  });

}

async function sendAuthEmail(to, code) {
  await transporter.sendMail({
    from: '"FIN IT" <no-reply@tuapp.com>',
    to,
    subject: '🔑 Tu código de verificación para FIN IT',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2e86de;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            color: white;
            margin: 0;
          }
          .content {
            padding: 25px;
            background-color: #f9f9f9;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e1e1e1;
          }
          .code-container {
            background-color: white;
            border: 2px dashed #2e86de;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 5px;
          }
          .code {
            font-size: 28px;
            letter-spacing: 3px;
            color: #2e86de;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2e86de;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
          .logo {
            max-width: 150px;
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FIN IT</h1>
        </div>
        
        <div class="content">
          <p>¡Hola!</p>
          <p>Gracias por registrarte en nuestra aplicación. Para completar tu registro, por favor utiliza el siguiente código de verificación:</p>
          
          <div class="code-container">
            <div class="code">${code}</div>
          </div>
          
          <p>Este código es válido por <strong>10 minutos</strong>. Si no lo usas en ese tiempo, deberás solicitar uno nuevo.</p>
          
          <p>Si no has solicitado este código, por favor ignora este mensaje.</p>
          
          <p>¡Gracias por unirte a nuestra comunidad!</p>
          
          <p>El equipo de FIN IT</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} FIN IT . Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `,
    text: `Tu código de verificación para FIN IT es: ${code}\n\nEste código expirará en 10 minutos.`
  });
}

module.exports = { sendRecoveryEmail, sendAuthEmail };
