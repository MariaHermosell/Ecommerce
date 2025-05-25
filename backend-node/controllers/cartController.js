const Cart = require('../models/Cart'); 

// Añadir producto al carrito
const addProductToCart = async (req, res) => {
  const usuarioId = req.usuarioId;       // usuario: si está logueado
  const { sessionId } = req.params;      // para usuarios anónimos
  const { productId, cantidad } = req.body;

  if (!productId || !cantidad) {
    return res.status(400).json({ mensaje: 'Faltan datos en la petición' });
  }

  try {
    // Busca el carrito según usuario autenticado o sessionId
    let query = usuarioId ? { usuario: usuarioId } : { sessionId };

    let carrito = await Cart.findOne(query);

    if (!carrito) {
      carrito = new Cart({ ...query, items: [] });
    }

    // Busca si producto ya está en el carrito
    const itemIndex = carrito.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      carrito.items[itemIndex].cantidad += cantidad;
    } else {
      carrito.items.push({ productId, cantidad });
    }

    await carrito.save();
    return res.json({ mensaje: 'Producto añadido al carrito', carrito });
  } catch (error) {
    console.error('Error al añadir producto al carrito:', error);
    return res.status(500).json({ mensaje: 'Error al añadir producto al carrito' });
  }
};

module.exports = { addProductToCart };
