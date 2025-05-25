const Usuario = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registro
const registrar = async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario)
      return res.status(400).json({ mensaje: "El usuario ya existe" });

    const salt = await bcrypt.genSalt(10);
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

    usuario = new Usuario({ nombre, email, contraseña: contraseñaHasheada });
    await usuario.save();

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Login
const login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(400).json({ mensaje: "Credenciales inválidas" });

    const esCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esCorrecta)
      return res.status(400).json({ mensaje: "Credenciales inválidas" });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

module.exports = { registrar, login };
