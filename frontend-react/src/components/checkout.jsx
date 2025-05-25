import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "../css/checkout.css";

// Clave pública de Stripe (test)
const stripePromise = loadStripe(
  "pk_test_51RSj2S2fI1yhs29X6tGvtYNUIEsDFDlkMDfDoSUNlcVDHcas2im3iNrfhjMeRIoubgqJDCNsYA1BOfqf35QLiGDv00Sz6oNfgy"
);

export default function Checkout({ carrito, onPedidoFinalizado }) {
  const [direccion, setDireccion] = useState({
    calle: "",
    ciudad: "",
    provincia: "",
    cp: "",
    telefono: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/usuarios/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.direccion) {
          setDireccion(data.direccion);
        }
      })
      .catch((err) => console.error("Error al cargar dirección:", err));
  }, []);

  const guardarDireccionYRedirigirAPago = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("No estás logueado");

    // 1. Guardar dirección
    await fetch("http://localhost:5000/api/usuarios/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ direccion }),
    });

    // 2. Crear sesión de Stripe en backend
    const res = await fetch("http://localhost:5000/api/pago/crear-sesion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ carrito }),
    });

    const data = await res.json();
    if (!data.id) return alert("Error al iniciar sesión de pago");

    // 3. Redirigir a Stripe Checkout
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  const total = carrito.reduce((sum, p) => sum + parseFloat(p.precio), 0);

  return (
    <div className="checkout-container">
      <h2>Resumen del pedido</h2>
      {carrito.map((p, i) => (
        <div key={i} className="producto-resumen">
          <img src={p.imagen} alt={p.nombre} />
          <div className="producto-info">
            <div>{p.nombre}</div>
            <div>Talla: {p.talla}</div>
            <div>{p.precio} €</div>
          </div>
        </div>
      ))}
      <div className="total-pedido">Total: {total.toFixed(2)} €</div>

      <form
        className="checkout-form"
        onSubmit={(e) => {
          e.preventDefault();
          guardarDireccionYRedirigirAPago();
        }}
      >
        <h3>Dirección de envío</h3>
        <input
          placeholder="Calle"
          required
          value={direccion.calle}
          onChange={(e) =>
            setDireccion({ ...direccion, calle: e.target.value })
          }
        />
        <input
          placeholder="Ciudad"
          required
          value={direccion.ciudad}
          onChange={(e) =>
            setDireccion({ ...direccion, ciudad: e.target.value })
          }
        />
        <input
          placeholder="Provincia"
          required
          value={direccion.provincia}
          onChange={(e) =>
            setDireccion({ ...direccion, provincia: e.target.value })
          }
        />
        <input
          placeholder="Código Postal"
          required
          value={direccion.cp}
          onChange={(e) => setDireccion({ ...direccion, cp: e.target.value })}
        />
        <input
          placeholder="Teléfono"
          required
          value={direccion.telefono}
          onChange={(e) =>
            setDireccion({ ...direccion, telefono: e.target.value })
          }
        />

        <button type="submit">Pagar con Stripe</button>
        <button
          type="button"
          onClick={() => (window.location.href = "/")}
          style={{ marginTop: "1rem", backgroundColor: "#ccc", color: "#000" }}
        >
          Cancelar y volver al inicio
        </button>
      </form>
    </div>
  );
}
