const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conectarDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba 
app.get('/', (req, res) => {
  res.send('API funcionando 🎉');
});

// Conexión a MongoDB
conectarDB();

// Rutas de la API
const userRoutes = require('./routes/userRoutes');
app.use('/api/usuarios', userRoutes);
const productRoutes = require('./routes/productRoutes');
app.use('/api/productos', productRoutes);
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/carrito', cartRoutes);
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/pedidos', orderRoutes);
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);
const contactRoutes = require('./routes/contact');
app.use('/api/contacto', contactRoutes);
const pagoRoutes = require("./routes/payRoutes");
app.use("/api/pago", pagoRoutes);


module.exports = app;
