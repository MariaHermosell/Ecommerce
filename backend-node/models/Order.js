const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  items: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true },
    }
  ],
  total: { type: Number, required: true },
  estado: { type: String, default: 'pendiente' }, 
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', orderSchema);
