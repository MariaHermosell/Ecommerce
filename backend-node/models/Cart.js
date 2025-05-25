const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: function() { return !this.usuario; } 
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: function() { return !this.sessionId; } 
  },
  items: [cartItemSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Cart', cartSchema);
