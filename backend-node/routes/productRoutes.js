const express = require('express');
const router = express.Router();
const { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productController');
const protegerRuta = require('../middleware/authMiddleware');
const verificarAdmin = require('../middleware/verificarAdmin');

// Rutas públicas
router.get('/', obtenerProductos);

// Rutas protegidas admin
router.post('/', protegerRuta, verificarAdmin, crearProducto);
router.put('/:id', protegerRuta, verificarAdmin, actualizarProducto);
router.delete('/:id', protegerRuta, verificarAdmin, eliminarProducto);

module.exports = router;
