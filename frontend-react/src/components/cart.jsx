import React from 'react';
import "../css/cart.css";

export default function Carrito({ carrito, onCerrar, onEliminarProducto, onFinalizarCompra }) {
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  return (
    <div className="cart-modal-overlay" onClick={onCerrar}>
      <div className="cart-modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onCerrar} className="cart-close-button">Cerrar</button>
        <h3>Tu carrito</h3>
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <>
            <ul className="cart-list">
              {carrito.map((item, idx) => (
                <li key={idx} className="cart-item">
                  <img src={item.imagen} alt={item.nombre} className="carrito-miniatura" />
                  <span>{item.nombre} - Talla: {item.talla} - {item.precio} €</span>
                  <button onClick={() => onEliminarProducto(idx)} className="cart-remove-button">Eliminar</button>
                </li>
              ))}
            </ul>
            <p className="cart-total">Total: {total.toFixed(2)} €</p>
            <button
              onClick={() => {
                onCerrar();
                if (onFinalizarCompra) onFinalizarCompra();
              }}
              className="cart-finalizar-button"
            >
              Finalizar compra
            </button>
          </>
        )}
      </div>
    </div>
  );
}
