const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const Usuario = require('../models/User'); 

describe('User Controller', () => {
  let token = '';

  beforeAll(async () => {
    // Limpiar usuario test para evitar duplicados
    await Usuario.deleteOne({ email: 'testuser@example.com' });
  });

  it('Debe registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios/registro')
      .send({
        nombre: 'TestUser',
        email: 'testuser@example.com',
        contraseña: 'test1234'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('Debe iniciar sesión y devolver token', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'testuser@example.com',
        contraseña: 'test1234'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('Debe obtener el perfil del usuario autenticado', async () => {
    const res = await request(app)
      .get('/api/usuarios/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
    expect(res.body).toHaveProperty('nombre', 'TestUser');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
