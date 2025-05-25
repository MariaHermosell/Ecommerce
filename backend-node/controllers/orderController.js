const Pedido = require('../models/Order');
const Cart = require('../models/Cart');
const enviarCorreo = require('../utils/email');
const Usuario = require('../models/User');

const crearPedido = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
      return res.status(401).json({ mensaje: 'No autorizado' });
    }

    const cart = await Cart.findOne({ usuario: usuarioId }).populate('items.producto');
    if (!cart) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
    if (cart.items.length === 0) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    const total = cart.items.reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0
    );

    const pedido = new Pedido({
      usuario: usuarioId,
      items: cart.items.map(item => ({
        producto: item.producto._id,
        cantidad: item.cantidad,
      })),
      total,
      estado: 'pendiente', 
    });

    await pedido.save();

    cart.items = [];
    await cart.save();

    res.status(201).json(pedido);
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ mensaje: 'Error al crear pedido' });
  }
};

const obtenerPedidosUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    if (!usuarioId) {
      return res.status(401).json({ mensaje: 'No autorizado' });
    }
    const pedidos = await Pedido.find({ usuario: usuarioId })
      .populate('items.producto')
      .sort({ creadoEn: -1 });
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }
};

const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    
    const pedido = await Pedido.findById(id);
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });

    pedido.estado = estado;
    await pedido.save();

    const usuario = await Usuario.findById(pedido.usuario);
    if (usuario) {
      const asunto = `Actualización de estado de tu pedido #${pedido._id}`;
      const mensaje = `Hola ${usuario.nombre},\n\nEl estado de tu pedido ha sido actualizado a: ${estado}. Gracias por comprar con nosotros.`;
      enviarCorreo(usuario.email, asunto, mensaje);
    }

    res.json({ mensaje: 'Estado del pedido actualizado', pedido });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado del pedido' });
  }
};

module.exports = { crearPedido, obtenerPedidosUsuario, actualizarEstadoPedido };
