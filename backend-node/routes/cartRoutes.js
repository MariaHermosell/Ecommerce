const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Producto = require('../models/Product');
const protegerRuta = require('../middleware/authMiddleware');

// --- RUTAS USUARIO AUTENTICADO --- //

// Obtener carrito del usuario autenticado
router.get('/', protegerRuta, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    let cart = await Cart.findOne({ usuario: usuarioId }).populate('items.producto');
    if (!cart) {
      cart = new Cart({ usuario: usuarioId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el carrito' });
  }
});

// Añadir producto al carrito del usuario autenticado
router.post('/add', protegerRuta, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) {
      return res.status(400).json({ mensaje: 'Faltan datos en la petición' });
    }

    let cart = await Cart.findOne({ usuario: usuarioId });
    if (!cart) {
      cart = new Cart({ usuario: usuarioId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.producto.toString() === productoId);
    if (itemIndex > -1) {
      cart.items[itemIndex].cantidad += cantidad;
    } else {
      cart.items.push({ producto: productoId, cantidad });
    }

    await cart.save();
    cart = await cart.populate('items.producto');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al añadir producto al carrito' });
  }
});

// Actualizar cantidad de producto en carrito del usuario autenticado
router.put('/update', protegerRuta, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { productoId, cantidad } = req.body;

    if (cantidad < 1) {
      return res.status(400).json({ mensaje: 'La cantidad debe ser al menos 1' });
    }

    let cart = await Cart.findOne({ usuario: usuarioId });
    if (!cart) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(item => item.producto.toString() === productoId);
    if (itemIndex === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
    }

    cart.items[itemIndex].cantidad = cantidad;

    await cart.save();
    cart = await cart.populate('items.producto');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cantidad del producto' });
  }
});

// Eliminar producto del carrito del usuario autenticado
router.delete('/remove', protegerRuta, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { productoId } = req.body;

    let cart = await Cart.findOne({ usuario: usuarioId });
    if (!cart) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(item => item.producto.toString() !== productoId);

    await cart.save();
    cart = await cart.populate('items.producto');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto del carrito' });
  }
});

// Vaciar carrito del usuario autenticado
router.delete('/clear', protegerRuta, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    let cart = await Cart.findOne({ usuario: usuarioId });
    if (!cart) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    cart.items = [];
    await cart.save();

    res.json({ mensaje: 'Carrito vaciado correctamente', cart });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al vaciar el carrito' });
  }
});


// --- RUTAS USUARIO ANÓNIMO (con sessionId) --- //

// Obtener carrito por sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    let cart = await Cart.findOne({ sessionId }).populate('items.producto');
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el carrito' });
  }
});

// Añadir producto al carrito por sessionId
router.post('/:sessionId/add', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) {
      return res.status(400).json({ mensaje: 'Faltan datos en la petición' });
    }

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.producto.toString() === productoId);
    if (itemIndex > -1) {
      cart.items[itemIndex].cantidad += cantidad;
    } else {
      cart.items.push({ producto: productoId, cantidad });
    }

    await cart.save();
    cart = await cart.populate('items.producto');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al añadir producto al carrito' });
  }
});

// Actualizar cantidad de producto en carrito por sessionId
router.put('/:sessionId/update', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productoId, cantidad } = req.body;

    if (cantidad < 1) {
      return res.status(400).json({ mensaje: 'La cantidad debe ser al menos 1' });
    }

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(item => item.producto.toString() === productoId);
    if (itemIndex === -1) {
      return res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
    }

    cart.items[itemIndex].cantidad = cantidad;

    await cart.save();
    cart = await cart.populate('items.producto');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cantidad del producto' });
  }
});

// Eliminar producto del carrito por sessionId
router.delete('/:sessionId/remove', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productoId } = req.body;

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(item => item.producto.toString() !== productoId);

    await cart.save();
    cart = await cart.populate('items.producto');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto del carrito' });
  }
});

// Vaciar carrito por sessionId
router.delete('/:sessionId/clear', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    cart.items = [];
    await cart.save();

    res.json({ mensaje: 'Carrito vaciado correctamente', cart });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al vaciar el carrito' });
  }
});

module.exports = router;
