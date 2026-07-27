import {
  cargarPartidasBackend,
  cargarStatsBackend,
  guardarPartidaBackend,
  importarStatsBackend,
} from "../api/backend";
import { cargarPartidas, cargarStats } from "../api/storage";

// Sube al backend los datos locales, solo si el backend está vacío
export async function migrarDatosLocales(token) {
  try {
    const [partidasBackend, statsBackend] = await Promise.all([
      cargarPartidasBackend(token),
      cargarStatsBackend(token),
    ]);

    const backendVacio =
      partidasBackend.length === 0 && statsBackend.jugadas === 0;
    if (!backendVacio) return;

    const locales = cargarPartidas();
    for (const [f, p] of Object.entries(locales)) {
      await guardarPartidaBackend(token, f, p.guesses, p.estado);
    }

    const statsLocales = cargarStats();
    if (statsLocales.jugadas > 0) {
      await importarStatsBackend(token, statsLocales);
    }
  } catch (e) {
    console.log("Error migrando datos locales:", e.message);
  }
}