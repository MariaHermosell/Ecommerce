import React, { useEffect } from "react";

export default function Success({ onPagoExitoso }) {
  useEffect(() => {
    // Vaciar carrito tras pago
    if (onPagoExitoso) onPagoExitoso();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido se ha realizado correctamente.</p>
    </div>
  );
}
