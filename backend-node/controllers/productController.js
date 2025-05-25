const Producto = require('../models/Product');

// Obtener todos los productos (público)
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// Crear producto (admin)
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen, categoria } = req.body;

    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const nuevoProducto = new Product({ nombre, descripcion, precio, imagen, categoria });
    await nuevoProducto.save();

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};


// Actualizar producto (admin)
const actualizarProducto = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();
    const producto = await Producto.findByIdAndUpdate(id, req.body, { new: true });
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

// Eliminar producto (admin)
const eliminarProducto = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();
      console.log("ID recibido para eliminar:", id);
     
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

module.exports = { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto };
