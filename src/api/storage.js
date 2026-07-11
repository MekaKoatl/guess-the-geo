const CLAVE = "guess-the-geo:partida";

// Fecha de hoy en UTC
export function fechaHoy() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// Guarda la partida de hoy
export function guardarPartida(guesses, estado) {
  try {
    const datos = { fecha: fechaHoy(), guesses, estado };
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch {
    // Si el navegador bloquea localStorage, seguimos sin guardar
  }
}

// 
export function cargarPartida() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return null;

    const datos = JSON.parse(crudo);
    if (datos.fecha !== fechaHoy()) return null; // es de otro día

    return datos;
  } catch {
    return null;
  }
}