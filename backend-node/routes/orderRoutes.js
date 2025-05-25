const express = require('express');
const router = express.Router();
const protegerRuta = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const { crearPedido, obtenerPedidosUsuario, actualizarEstadoPedido } = require('../controllers/orderController');

// Middleware para validar resultados de express-validator
const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

router.post('/', protegerRuta, crearPedido); // Crear pedido

router.get('/', protegerRuta, obtenerPedidosUsuario); // Obtener historial

router.put(
  '/:id/estado',
  protegerRuta,
  body('estado').isIn(['pendiente', 'completado', 'cancelado']).withMessage('Estado no válido'),
  validarCampos,
  actualizarEstadoPedido
);

module.exports = router;
