const express = require("express");
const router = express.Router();
const { registrar, login } = require("../controllers/userController");
const protegerRuta = require("../middleware/authMiddleware");
const Usuario = require("../models/User");
const bcrypt = require("bcryptjs");

// Rutas públicas
router.post("/registro", registrar);
router.post("/login", login);

// Ruta para obtener perfil (protegida)
router.get("/perfil", protegerRuta, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select("-contraseña");
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener perfil" });
  }
});

// Ruta para actualizar perfil (protegida)
router.put("/perfil", protegerRuta, async (req, res) => {
  try {
    const { nombre, email, contraseña, direccion } = req.body;
    const usuario = await Usuario.findById(req.usuarioId);

    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    console.log("Usuario antes de actualizar:", usuario);
    console.log("Dirección recibida:", direccion);

    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;

    if (direccion) {
      usuario.direccion = {
        calle: direccion.calle || usuario.direccion?.calle,
        ciudad: direccion.ciudad || usuario.direccion?.ciudad,
        provincia: direccion.provincia || usuario.direccion?.provincia,
        cp: direccion.cp || usuario.direccion?.cp,
        telefono: direccion.telefono || usuario.direccion?.telefono,
      };
    }

    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      usuario.contraseña = await bcrypt.hash(contraseña, salt);
    }
    console.log("Usuario después de guardar:", usuario);

    await usuario.save();

    res.json({ mensaje: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ mensaje: "Error al actualizar perfil" });
  }
});
router.put('/carrito', protegerRuta, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.carrito = req.body.carrito;
    await usuario.save();
    res.json({ mensaje: 'Carrito actualizado' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al guardar el carrito' });
  }
});

router.get('/carrito', protegerRuta, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json({ carrito: usuario.carrito || [] });
  } catch (err) {
    console.error("Error al obtener carrito:", err);
    res.status(500).json({ mensaje: 'Error al obtener el carrito' });
  }
});


module.exports = router;
