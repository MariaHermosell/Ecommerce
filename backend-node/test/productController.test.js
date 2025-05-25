const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index'); 
const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');

let tokenAdmin = '';

beforeAll(async () => {
  // Crear admin si no existe
  let admin = await Usuario.findOne({ email: 'admin@example.com' });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('admin1234', salt);
    admin = new Usuario({ nombre: 'Admin', email: 'admin@example.com', contraseña: hashed, rol: 'admin' });
    await admin.save();
  }

  // Login admin para obtener token
  const res = await request(app)
    .post('/api/usuarios/login')
    .send({
      email: 'admin@example.com',
      contraseña: 'admin1234'
    });

  tokenAdmin = res.body.token;
});

describe('Product Controller', () => {
  let productoId = '';

  it('Debe obtener todos los productos (GET)', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Debe crear un producto (POST) - admin', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Producto Test',
        descripcion: 'Descripción del producto test',
        precio: 9.99,
        imagen: 'https://via.placeholder.com/150'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    productoId = res.body._id;
  });

  it('Debe actualizar un producto (PUT) - admin', async () => {
    const res = await request(app)
      .put(`/api/productos/${productoId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        precio: 19.99
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('precio', 19.99);
  });

  it('Debe eliminar un producto (DELETE) - admin', async () => {
    const res = await request(app)
      .delete(`/api/productos/${productoId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Producto eliminado correctamente');
  });
  afterAll(async () => {
  await mongoose.connection.close();
});

});
