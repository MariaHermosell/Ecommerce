import React, { useEffect, useState } from "react";
import Fuse from "fuse.js";
import "./css/app.css";
import Header from "./components/Header";
import ProductGallery from "./components/productGallery";
import ContactForm from "./components/contactForm";
import SobreNosotros from "./components/aboutUs";
import Carrito from "./components/cart";
import logo from "./assets/logo.png";
import PoliticaDevoluciones from "./components/returnPolicy";
import PreguntasFrecuentes from "./components/faq";
import Login from "./components/login";
import Registro from "./components/registration";
import Checkout from "./components/checkout";
import ModificarDatos from "./components/editProfile";
import Success from "./components/success";

function App() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [seccion, setSeccion] = useState("home");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [pendienteDeCheckout, setPendienteDeCheckout] = useState(false);
  const [esPagoExitoso, setEsPagoExitoso] = useState(false);
  const [carritoCargadoDesdeBackend, setCarritoCargadoDesdeBackend] =
    useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/productos")
      .then((res) => res.json())
      .then(setProductos)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/usuarios/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.nombre) {
          setUsuarioLogueado(data.nombre);
          return fetch("http://localhost:5000/api/usuarios/carrito", {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      })
      .then((res) => res?.json())
      .then((data) => {
        if (Array.isArray(data?.carrito)) {
          setCarrito(data.carrito);
          setCarritoCargadoDesdeBackend(true);
        }
      })
      .catch((err) => {
        console.error("Error restaurando sesión o carrito:", err);
        localStorage.removeItem("token");
      });
  }, [esPagoExitoso]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      const carritoGuardado = localStorage.getItem("carrito");
      if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));
    }
  }, [esPagoExitoso]);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));

    const token = localStorage.getItem("token");
    if (token && carritoCargadoDesdeBackend) {
      fetch("http://localhost:5000/api/usuarios/carrito", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ carrito }),
      }).catch((err) => console.error("Error guardando carrito:", err));
    }
  }, [carrito, carritoCargadoDesdeBackend]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const esSuccess = params.get("success") === "true";

    if (esSuccess) {
      setEsPagoExitoso(true);
      setSeccion("success");
      window.history.replaceState({}, "", "/"); 
    }
  }, []);

  const fuse = new Fuse(productos, {
    keys: ["nombre", "categoria", "descripcion"],
    threshold: 0.1,
  });

  const productosFiltrados = terminoBusqueda
    ? fuse.search(terminoBusqueda).map((result) => result.item)
    : productos;

  const productosFinales = productosFiltrados.filter(
    (p) => categoriaSeleccionada === "" || p.categoria === categoriaSeleccionada
  );

  const agregarAlCarrito = (productoConTalla) => {
    setCarrito((prev) => [...prev, productoConTalla]);
  };

  const eliminarProductoCarrito = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const abrirCarrito = () => setMostrarCarrito(true);
  const cerrarCarrito = () => setMostrarCarrito(false);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuarioLogueado(null);
    setSeccion("home");
  };

  return (
    <>
      <Header
        onCategoriaChange={(cat) => {
          setCategoriaSeleccionada(cat);
          setTerminoBusqueda("");
          setSeccion("home");
        }}
        onSeccionChange={setSeccion}
        onBuscar={(valor) => {
          setTerminoBusqueda(valor);
          if (valor !== "") setCategoriaSeleccionada("");
        }}
        onAbrirCarrito={abrirCarrito}
        carrito={carrito}
        usuarioLogueado={usuarioLogueado}
        onIrALogin={() => setSeccion("login")}
        onCerrarSesion={cerrarSesion}
      />

      <div className="app-container">
        <div className="app-logo-container">
          <h1 className="app-logo-heading">
            <img src={logo} alt="Maria Hermosell" className="app-logo-image" />
          </h1>
        </div>

        {seccion === "home" &&
          (productosFinales.length > 0 ? (
            <ProductGallery
              productos={productosFinales}
              categoria={categoriaSeleccionada}
              onAgregarAlCarrito={agregarAlCarrito}
            />
          ) : (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              No se encontraron productos para "{terminoBusqueda}"
            </p>
          ))}

        {seccion === "contacto" && <ContactForm />}
        {seccion === "sobrenosotros" && <SobreNosotros />}
        {seccion === "politica-devoluciones" && <PoliticaDevoluciones />}
        {seccion === "preguntas-frecuentes" && <PreguntasFrecuentes />}
        {seccion === "modificar-datos" && <ModificarDatos />}

        {seccion === "login" && (
          <Login
            onIrARegistro={() => setSeccion("registro")}
            onLoginExitoso={(nombreUsuario, carritoBD) => {
              setUsuarioLogueado(nombreUsuario);
              setCarrito(carritoBD);
              if (pendienteDeCheckout) {
                setSeccion("checkout");
                setPendienteDeCheckout(false);
              } else {
                setSeccion("home");
              }
            }}
          />
        )}

        {seccion === "registro" && (
          <Registro onIrALogin={() => setSeccion("login")} />
        )}

        {seccion === "checkout" && (
          <Checkout
            carrito={carrito}
            onPedidoFinalizado={() => {
              setCarrito([]);
              setSeccion("home");
            }}
          />
        )}
      </div>
      {seccion === "success" && (
        <Success
          onPagoExitoso={async () => {
            setCarrito([]);
            localStorage.removeItem("carrito");

            const token = localStorage.getItem("token");
            if (token) {
              try {
                await fetch("http://localhost:5000/api/usuarios/carrito", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ carrito: [] }),
                });
              } catch (err) {
                console.error("Error al vaciar carrito en el backend:", err);
              }
            }

            setSeccion("home");
          }}
        />
      )}

      {mostrarCarrito && (
        <Carrito
          carrito={carrito}
          onCerrar={cerrarCarrito}
          onEliminarProducto={eliminarProductoCarrito}
          onFinalizarCompra={() => {
            setMostrarCarrito(false);
            if (!usuarioLogueado) {
              setPendienteDeCheckout(true);
              setSeccion("login");
            } else {
              setSeccion("checkout");
            }
          }}
        />
      )}
    </>
  );
}

export default App;
