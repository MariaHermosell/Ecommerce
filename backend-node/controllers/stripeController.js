const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.crearSesionPago = async (req, res) => {
  try {
    const carrito = req.body.carrito;

    const line_items = carrito.map((producto) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: producto.nombre,
          images: [producto.imagen || "https://via.placeholder.com/150"],
        },
        unit_amount: Math.round(producto.precio * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "http://localhost:5173?success=true",
      cancel_url: "http://localhost:5173/checkout",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Error al crear sesión de Stripe:", err);
    res.status(500).json({ mensaje: "Error al crear la sesión de pago" });
  }
};
