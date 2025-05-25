const Usuario = require('../models/User');

const verificarAdmin = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    if (usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores' });
    }
    next();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

module.exports = verificarAdmin;
