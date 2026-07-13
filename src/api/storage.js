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