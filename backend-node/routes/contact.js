const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const { EMAIL_USER, EMAIL_PASS } = process.env;

router.post('/', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { nombre, email, asunto, mensaje } = req.body;

  if (!nombre || !email || !asunto || !mensaje) {
    return res.status(400).send('Faltan campos obligatorios');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  const mailOptions = {
    from: email,
    to: EMAIL_USER,
    subject: `Consulta: ${asunto}`,
    text: `De: ${nombre} <${email}>\n\n${mensaje}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Correo enviado');
  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).send('Error enviando correo');
  }
});

module.exports = router;
