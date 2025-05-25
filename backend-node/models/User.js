const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  direccion: {
    calle: String,
    ciudad: String,
    provincia: String,
    cp: String,
    telefono: String
  },
  rol: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  carrito: {
  type: Array,
  default: []
}

}, {
  timestamps: true,
});

module.exports = mongoose.model('Usuario', userSchema);
