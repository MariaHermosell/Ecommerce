const express = require("express");
const router = express.Router();
const { crearSesionPago } = require("../controllers/stripeController");

// Ruta POST para crear la sesión de Stripe
router.post("/crear-sesion", crearSesionPago);

module.exports = router;
