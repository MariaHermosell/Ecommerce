// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error(err.stack);

 
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      mensaje: 'Error de validación',
      detalles: err.message,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      mensaje: 'ID no válido',
      detalles: err.message,
    });
  }


  res.status(500).json({
    mensaje: 'Error interno del servidor',
  });
}

module.exports = errorHandler;
