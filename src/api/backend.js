const API = import.meta.env.VITE_API_URL;

// Helper interno: hace la petición y maneja el token y errores
async function pedir(ruta, { metodo = "GET", body, token } = {}) {
  const opciones = {
    method: metodo,
    headers: { "Content-Type": "application/json" },
  };

  if (token) opciones.headers.Authorization = `Bearer ${token}`;
  if (body) opciones.body = JSON.stringify(body);

  const res = await fetch(`${API}${ruta}`, opciones);
  const datos = await res.json();

  if (!res.ok) {
    throw new Error(datos.error || "Error en la petición");
  }
  return datos;
}

// --- AUTENTICACIÓN ---
export function registrar(username, email, password) {
  return pedir("/api/auth/register", {
    metodo: "POST",
    body: { username, email, password },
  });
}

export function iniciarSesion(email, password) {
  return pedir("/api/auth/login", {
    metodo: "POST",
    body: { email, password },
  });
}

// --- PARTIDAS ---
export function guardarPartidaBackend(token, fecha, guesses, estado) {
  return pedir("/api/games", {
    metodo: "POST",
    token,
    body: { fecha, guesses, estado },
  });
}

export function cargarPartidasBackend(token) {
  return pedir("/api/games", { token });
}

// --- STATS ---
export function cargarStatsBackend(token) {
  return pedir("/api/stats", { token });
}

export function registrarResultadoBackend(token, gano, intentos) {
  return pedir("/api/stats/registrar", {
    metodo: "POST",
    token,
    body: { gano, intentos },
  });
}