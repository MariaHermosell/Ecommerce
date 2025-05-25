const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
test('prueba básica', () => {
  expect(1 + 1).toBe(2);

});
  afterAll(async () => {
  await mongoose.connection.close();
});
