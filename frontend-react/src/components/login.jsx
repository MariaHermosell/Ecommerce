import React, { useState } from "react";
import "../css/loginForm.css";

export default function Login({ onIrARegistro, onLoginExitoso }) {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Error al iniciar sesión");
        return;
      }

      // Guardamos el token
      localStorage.setItem("token", data.token);

      // Obtenemos el perfil para sacar el nombre del usuario
      const perfilRes = await fetch(
        "http://localhost:5000/api/usuarios/perfil",
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const perfil = await perfilRes.json();

      if (!perfil.nombre) {
        alert("Error al obtener el nombre del usuario.");
        return;
      }

      // Pasamos el nombre al componente padre
      if (onLoginExitoso) onLoginExitoso(perfil.nombre, perfil.carrito || []);
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          className="form-input"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit" className="form-button">
          Entrar
        </button>
      </form>

      <div className="form-link">
        <p>¿No tienes cuenta?</p>
        <button onClick={onIrARegistro} className="form-button">
          Registrarse
        </button>
      </div>
    </div>
  );
}
