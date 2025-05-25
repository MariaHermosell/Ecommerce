import React, { useState } from "react";
import "../css/loginForm.css"; 

export default function Registro({ onIrALogin }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, contraseña }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Error al registrarse");
        return;
      }

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      if (onIrALogin) onIrALogin();
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="form-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          className="form-input"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña:</label>
        <input
          className="form-input"
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit" className="form-button">Registrarse</button>
      </form>

      <div className="form-link">
        <p>¿Ya tienes cuenta?</p>
        <button onClick={onIrALogin} className="form-button">Iniciar sesión</button>
      </div>
    </div>
  );
}
