const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const Cart = require('../models/Cart');
const Usuario = require('../models/User');

describe('Cart Controller', () => {
  let token = '';       // Token usuario normal
  let tokenAdmin = '';  // Token admin
  let userId = '';
  let productId = '';
  const sessionId = 'test-session-123';

  beforeAll(async () => {
    // Crear usuario normal y obtener token
    await Usuario.deleteOne({ email: 'cartuser@example.com' });

    const resRegister = await request(app)
      .post('/api/usuarios/registro')
      .send({
        nombre: 'CartUser',
        email: 'cartuser@example.com',
        contraseña: 'test1234',
      });
    expect(resRegister.statusCode).toBe(201);
    token = resRegister.body.token;

    const resPerfil = await request(app)
      .get('/api/usuarios/perfil')
      .set('Authorization', `Bearer ${token}`);
    userId = resPerfil.body._id;

    // Crear admin si no existe y obtener token admin
    let adminUser = await Usuario.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash('admin1234', salt);
      adminUser = new Usuario({ nombre: 'Admin', email: 'admin@example.com', contraseña: hashed, rol: 'admin' });
      await adminUser.save();
    }
    const resAdminLogin = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'admin@example.com',
        contraseña: 'admin1234',
      });
    tokenAdmin = resAdminLogin.body.token;

    // Crear producto con tokenAdmin para usar en tests
    const productRes = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Producto Test para carrito',
        descripcion: 'Producto para test de carrito',
        precio: 20,
        imagen: 'https://via.placeholder.com/150'
      });
    expect(productRes.statusCode).toBe(201);
    productId = productRes.body._id;

    // Limpiar carritos para usuario y sessionId
    await Cart.deleteOne({ usuario: userId });
    await Cart.deleteOne({ sessionId });
  });

  // Añadir producto al carrito usuario autenticado
  it('Añadir producto al carrito usuario autenticado', async () => {
    const res = await request(app)
      .post('/api/carrito/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productoId: productId,
        cantidad: 2
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  // Añadir producto al carrito anónimo con sessionId
  it('Añadir producto al carrito anónimo con sessionId', async () => {
    const res = await request(app)
      .post(`/api/carrito/${sessionId}/add`)
      .send({
        productoId: productId,
        cantidad: 1
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  // Devolver error si faltan datos en carrito autenticado
  it('Debe devolver error si faltan datos en carrito autenticado', async () => {
    const res = await request(app)
      .post('/api/carrito/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productoId: '',
        cantidad: 0
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('mensaje', 'Faltan datos en la petición');
  });

  // Devolver error si faltan datos en carrito anónimo
  it('Debe devolver error si faltan datos en carrito anónimo', async () => {
    const res = await request(app)
      .post(`/api/carrito/${sessionId}/add`)
      .send({
        productoId: '',
        cantidad: 0
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('mensaje', 'Faltan datos en la petición');
  });

  // Actualizar cantidad producto en carrito usuario autenticado
  it('Actualizar cantidad de producto en carrito usuario autenticado', async () => {
    const res = await request(app)
      .put('/api/carrito/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productoId: productId,
        cantidad: 5
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    // Busca el producto actualizado en items
    const item = res.body.items.find(i => i.producto._id.toString() === productId.toString());
    expect(item).toBeDefined();
    expect(item.cantidad).toBe(5);
  });

  // Eliminar producto del carrito usuario autenticado
  it('Eliminar producto del carrito usuario autenticado', async () => {
    const res = await request(app)
      .delete('/api/carrito/remove')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productoId: productId
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    const item = res.body.items.find(i => i.producto._id.toString() === productId.toString());
    expect(item).toBeUndefined();
  });

  // Vaciar carrito usuario autenticado
  it('Vaciar carrito usuario autenticado', async () => {
    // Primero añade un producto para que el carrito no esté vacío
    await request(app)
      .post('/api/carrito/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productoId: productId,
        cantidad: 2
      });

    // Ahora vacío el carrito
    const res = await request(app)
      .delete('/api/carrito/clear')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Carrito vaciado correctamente');
    expect(res.body.cart.items.length).toBe(0);
  });

  // Actualizar cantidad producto en carrito anónimo
  it('Actualizar cantidad de producto en carrito anónimo', async () => {
    // Primero añade un producto anónimo
    await request(app)
      .post(`/api/carrito/${sessionId}/add`)
      .send({
        productoId: productId,
        cantidad: 3
      });

    // Actualiza cantidad
    const res = await request(app)
      .put(`/api/carrito/${sessionId}/update`)
      .send({
        productoId: productId,
        cantidad: 7
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    const item = res.body.items.find(i => i.producto._id.toString() === productId.toString());
    expect(item).toBeDefined();
    expect(item.cantidad).toBe(7);
  });

  // Eliminar producto del carrito anónimo
  it('Eliminar producto del carrito anónimo', async () => {
    const res = await request(app)
      .delete(`/api/carrito/${sessionId}/remove`)
      .send({
        productoId: productId
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    const item = res.body.items.find(i => i.producto._id.toString() === productId.toString());
    expect(item).toBeUndefined();
  });

  // Vaciar carrito anónimo
  it('Vaciar carrito anónimo', async () => {
    // Primero añade un producto para que el carrito no esté vacío
    await request(app)
      .post(`/api/carrito/${sessionId}/add`)
      .send({
        productoId: productId,
        cantidad: 4
      });

    // Ahora vacío el carrito
    const res = await request(app)
      .delete(`/api/carrito/${sessionId}/clear`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Carrito vaciado correctamente');
    expect(res.body.cart.items.length).toBe(0);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
