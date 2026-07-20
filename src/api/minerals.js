import { MINERALS, NOMBRES } from "../data/minerals.js";

const API = import.meta.env.VITE_API_URL;

export async function getMinerales() {
  try {
    const res = await fetch(`${API}/api/minerals`);
    if (!res.ok) throw new Error("respuesta no OK");

    const minerales = await res.json();
    if (!Array.isArray(minerales) || minerales.length === 0) {
      throw new Error("sin datos");
    }

    // Reconstruir NOMBRES a partir de lo que llega
    const nombres = [...minerales.map((m) => m.nombre)].sort();
    return { minerales, nombres };
  } catch (e) {
    // Respaldo: usar los datos locales si el backend no responde
    console.log("Usando datos locales (backend no disponible):", e.message);
    return { minerales: MINERALS, nombres: NOMBRES };
  }
}