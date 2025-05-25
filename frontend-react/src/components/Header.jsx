import React, { useState } from "react";
import "../css/header.css";

export default function Header({
  onCategoriaChange,
  onSeccionChange,
  onBuscar,
  carrito,
  onAbrirCarrito,
  usuarioLogueado,
  onIrALogin,
  onCerrarSesion,
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const opcionesMenu = [
    { label: "Inicio", href: "/", categoria: "" },
    {
      label: "",
      submenu: [
        { label: "Blusas", categoria: "blusas" },
        { label: "Conjuntos", categoria: "conjuntos" },
        { label: "Pantalones", categoria: "pantalones" },
        { label: "Vestidos", categoria: "vestidos" },
        { label: "Chaquetas", categoria: "chaquetas" },
      ],
    },
    { label: "Contacto", href: "/contacto", categoria: "" },
    { label: "Sobre nosotros", href: "/sobrenosotros", categoria: "" },
    {
      label: "Política de devoluciones",
      href: "/politica-devoluciones",
      categoria: "",
    },
    {
      label: "Preguntas frecuentes",
      href: "/preguntas-frecuentes",
      categoria: "",
    },
    { label: "Modificar mis datos", href: "/modificar-datos", categoria: "" },
  ];

  function handleClickCategoria(categoria) {
    if (onCategoriaChange) {
      onCategoriaChange(categoria);
    }
    if (onSeccionChange) {
      onSeccionChange("home");
    }
    setMenuAbierto(false);
  }

  function handleClickSeccion(seccion) {
    if (onSeccionChange) {
      onSeccionChange(seccion);
    }
    setMenuAbierto(false);
  }

  function handleBusquedaChange(e) {
    const valor = e.target.value;
    setBusqueda(valor);
    if (onBuscar) onBuscar(valor);
    if (valor !== "") {
      onSeccionChange("home");
    }
  }

  return (
    <header className="header">
      <div
        className="menu-icon"
        aria-label="Menú"
        role="button"
        tabIndex={0}
        onClick={() => setMenuAbierto(!menuAbierto)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setMenuAbierto(!menuAbierto);
        }}
      >
        &#9776;
      </div>

      {menuAbierto && (
        <nav className="menu-desplegable" aria-label="Menú desplegable">
          <ul>
            {opcionesMenu.map((item, idx) => (
              <li key={idx}>
                {item.submenu ? (
                  <>
                    <span className="submenu-titulo">{item.label}</span>
                    <ul className="submenu">
                      {item.submenu.map((subitem, subidx) => (
                        <li key={subidx}>
                          <button
                            className="menu-button"
                            onClick={() =>
                              handleClickCategoria(subitem.categoria)
                            }
                          >
                            {subitem.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <button
                    className="menu-button"
                    onClick={() => {
                      const labelLower = item.label.toLowerCase();
                      if (labelLower === "contacto") {
                        handleClickSeccion("contacto");
                      } else if (labelLower === "sobre nosotros") {
                        handleClickSeccion("sobrenosotros");
                      } else if (labelLower === "política de devoluciones") {
                        handleClickSeccion("politica-devoluciones");
                      } else if (labelLower === "preguntas frecuentes") {
                        handleClickSeccion("preguntas-frecuentes");
                      } else if (labelLower === "modificar mis datos") {
                        handleClickSeccion("modificar-datos");
                      } else {
                        handleClickCategoria(item.categoria);
                      }
                    }}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="search-container">
        <input
          type="search"
          placeholder="Buscar"
          aria-label="Buscar productos"
          className="search-input"
          value={busqueda}
          onChange={handleBusquedaChange}
        />
      </div>
      <nav className="nav-links">
        {usuarioLogueado ? (
          <>
            <span className="usuario-nombre">Hola, {usuarioLogueado}</span>
            <button onClick={onCerrarSesion} className="menu-button">
              Cerrar sesión
            </button>
          </>
        ) : (
          <button onClick={onIrALogin} className="menu-button">
            Iniciar sesión
          </button>
        )}

        <button
          className="menu-button carrito-button"
          onClick={onAbrirCarrito}
          aria-label="Abrir carrito"
        >
          Cesta [{carrito.length}]
        </button>
      </nav>
    </header>
  );
}
