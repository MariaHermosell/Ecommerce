import React, { useState } from "react";
import "../css/productGallery.css";

const tallas = ["S", "M", "L", "XL"];

export default function ProductGallery({
  productos,
  categoria,
  onAgregarAlCarrito,
}) {
  const [modalProducto, setModalProducto] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(tallas[0]);

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase() !== "producto test para carrito" &&
      (categoria === "" || p.categoria === categoria)
  );

  const abrirModal = (producto) => {
    setModalProducto(producto);
    setTallaSeleccionada(tallas[0]); 
  };
  const cerrarModal = () => setModalProducto(null);

  return (
    <div className="product-gallery-container">
      <div className="product-gallery-inner">
        <div className="product-gallery-grid">
          {productosFiltrados.map((producto, index) => {
            const cardClass =
              index % 3 === 0 ? "product-card large" : "product-card small";

            return (
              <div
                key={producto._id}
                className={cardClass}
                onClick={() => abrirModal(producto)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-title">{producto.nombre}</h3>
                  <p className="product-price">{producto.precio} €</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalProducto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalProducto.imagen}
              alt={modalProducto.nombre}
              className="modal-image"
            />
            <h2>{modalProducto.nombre}</h2>
            <p style={{ color: "#444" }}>{modalProducto.descripcion}</p>
            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              {modalProducto.precio} €
            </p>

            <label htmlFor="talla-select">Selecciona talla:</label>
            <select
              id="talla-select"
              value={tallaSeleccionada}
              onChange={(e) => setTallaSeleccionada(e.target.value)}
              style={{ marginBottom: "1rem", padding: "0.3rem" }}
            >
              {tallas.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="modal-buttons">
              <button
                onClick={() => {
                  if (onAgregarAlCarrito) {
                    onAgregarAlCarrito({
                      ...modalProducto,
                      talla: tallaSeleccionada,
                    });
                  }
                  cerrarModal();
                }}
              >
                Añadir al carrito
              </button>

              <button onClick={cerrarModal} className="modal-close-button">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
