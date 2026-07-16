const CLAVE = "guess-the-geo:partidas";

export function fechaHoy() {
  return new Date().toISOString().slice(0, 10); // "2026-07-14"
}

// Todas las partidas guardadas, indexadas por fecha
export function cargarPartidas() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? JSON.parse(crudo) : {};
  } catch {
    return {};
  }
}

// Guarda la partida de una fecha concreta
export function guardarPartida(fecha, guesses, estado) {
  try {
    const todas = cargarPartidas();
    todas[fecha] = { guesses, estado };
    localStorage.setItem(CLAVE, JSON.stringify(todas));
  } catch {
    // sin almacenamiento: seguimos sin guardar
  }
}

// Devuelve la partida de una fecha, o null
export function cargarPartida(fecha) {
  const todas = cargarPartidas();
  return todas[fecha] || null;
}

const CLAVE_STATS = "guess-the-geo:stats";

// Estadísticas por defecto
const STATS_VACIAS = {
  jugadas: 0,
  ganadas: 0,
  racha: 0,
  mejorRacha: 0,
  ultimaFecha: null,
  distribucion: [0, 0, 0, 0, 0, 0], // victorias por nº de intentos (1..6)
};

export function cargarStats() {
  try {
    const crudo = localStorage.getItem(CLAVE_STATS);
    return crudo ? JSON.parse(crudo) : { ...STATS_VACIAS };
  } catch {
    return { ...STATS_VACIAS };
  }
}

// Registra el resultado de una partida terminada (solo una vez al día)
export function registrarResultado(gano, intentos) {
  try {
    const stats = cargarStats();
    const hoy = fechaHoy();

    // Si ya registramos hoy, no duplicar
    if (stats.ultimaFecha === hoy) return stats;

    // ¿La partida anterior fue ayer? Entonces la racha continúa
    const ayer = new Date();
    ayer.setUTCDate(ayer.getUTCDate() - 1);
    const fueAyer = stats.ultimaFecha === ayer.toISOString().slice(0, 10);

    stats.jugadas += 1;

    if (gano) {
      stats.ganadas += 1;
      stats.racha = fueAyer ? stats.racha + 1 : 1;
      stats.mejorRacha = Math.max(stats.mejorRacha, stats.racha);
      stats.distribucion[intentos - 1] += 1;
    } else {
      stats.racha = 0;
    }

    stats.ultimaFecha = hoy;
    localStorage.setItem(CLAVE_STATS, JSON.stringify(stats));
    return stats;
  } catch {
    return cargarStats();
  }
}

// === SESIÓN (token + usuario logueado) ===
const CLAVE_SESION = "guess-the-geo:sesion";

export function guardarSesion(token, user) {
  try {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ token, user }));
  } catch {
    // sin almacenamiento: la sesión no persiste
  }
}

export function cargarSesion() {
  try {
    const crudo = localStorage.getItem(CLAVE_SESION);
    return crudo ? JSON.parse(crudo) : null;
  } catch {
    return null;
  }
}

export function borrarSesion() {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch {
    // nada que hacer
  }
}
