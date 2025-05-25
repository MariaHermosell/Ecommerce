import React, { useState } from 'react';
import '../css/contactForm.css'; 

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');

    try {
      const response = await fetch('http://localhost:5000/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('Mensaje enviado correctamente');
        setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      } else {
        setStatus('Error al enviar el mensaje');
      }
    } catch (error) {
      setStatus('Error al enviar el mensaje');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <label htmlFor="nombre">Nombre:</label>
      <input
        id="nombre"
        name="nombre"
        type="text"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      <label htmlFor="email">Email:</label>
      <input
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="asunto">Asunto:</label>
      <input
        id="asunto"
        name="asunto"
        type="text"
        value={formData.asunto}
        onChange={handleChange}
        required
      />

      <label htmlFor="mensaje">Mensaje:</label>
      <textarea
        id="mensaje"
        name="mensaje"
        rows={5}
        value={formData.mensaje}
        onChange={handleChange}
        required
      />

      <button type="submit">Enviar</button>
      {status && <p>{status}</p>}
    </form>
  );
}
