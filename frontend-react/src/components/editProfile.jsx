import React, { useEffect, useState } from "react";

export default function ModificarDatos() {
  const [usuario, setUsuario] = useState({ nombre: "", email: "" });
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
        setUsuario({ nombre: data.nombre || "", email: data.email || "" });
        if (data.direccion) {
          setDireccion(data.direccion);
        }
      })
      .catch((err) => console.error("Error al cargar perfil:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("No estás logueado");

    await fetch("http://localhost:5000/api/usuarios/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...usuario, direccion }),
    });

    alert("Perfil actualizado correctamente");
  };

  return (
    <div className="form-container">
      <h2>Modificar datos de usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          className="form-input"
          type="text"
          value={usuario.nombre}
          onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
        />

        <label>Email:</label>
        <input
          className="form-input"
          type="email"
          value={usuario.email}
          onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
        />

        <label>Calle:</label>
        <input
          className="form-input"
          value={direccion.calle}
          onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })}
        />

        <label>Ciudad:</label>
        <input
          className="form-input"
          value={direccion.ciudad}
          onChange={(e) => setDireccion({ ...direccion, ciudad: e.target.value })}
        />

        <label>Provincia:</label>
        <input
          className="form-input"
          value={direccion.provincia}
          onChange={(e) => setDireccion({ ...direccion, provincia: e.target.value })}
        />

        <label>Código Postal:</label>
        <input
          className="form-input"
          value={direccion.cp}
          onChange={(e) => setDireccion({ ...direccion, cp: e.target.value })}
        />

        <label>Teléfono:</label>
        <input
          className="form-input"
          value={direccion.telefono}
          onChange={(e) => setDireccion({ ...direccion, telefono: e.target.value })}
        />

        <button className="form-button" type="submit">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}