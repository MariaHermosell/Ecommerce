// backend-node/models/Product.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  imagen: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  categoria: { type: String, required: true }

}, {
  timestamps: true,
});

module.exports = mongoose.model('Producto', productoSchema);
