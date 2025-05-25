const jwt = require('jsonwebtoken');

const protegerRuta = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ mensaje: 'Acceso no autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};

module.exports = protegerRuta;
