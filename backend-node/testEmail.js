require('dotenv').config();
const nodemailer = require('nodemailer');

async function enviarEmailPrueba() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'mariahermosellpro@gmail.com', // correo de prueba
    subject: 'Prueba de correo',
    text: 'Este es un correo de prueba para verificar que nodemailer funciona correctamente.',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
}

enviarEmailPrueba();
