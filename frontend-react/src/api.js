const API_URL = 'http://localhost:5000/api'; 

export async function registrarUsuario(datos) {
  const res = await fetch(`${API_URL}/usuarios/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return await res.json();
}

export async function loginUsuario(datos) {
  const res = await fetch(`${API_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return await res.json();
}

export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos`);
  return await res.json();
}
