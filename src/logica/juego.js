import { fechaHoy } from "../api/storage";

// === CONFIG ===
export const MAX_INTENTOS = 6;
const N_POPULARES = 20;
const N_RESTO = 11;
const CORTE_POPULARES = 40;
const FECHA_LANZAMIENTO = "2026-07-01";

export const norm = (s) =>
  s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// === COMPARACIÓN PARCIAL (amarillo) ===
const CAMPOS = [
  { key: "familia", label: "Misma familia" },
  { key: "color", label: "Mismo color" },
  { key: "sistema", label: "Mismo sistema cristalino" },
  { key: "rocaTipo", label: "Mismo tipo de roca" },
  { key: "composicion", label: "Composición parecida" },
];

export function coincidencias(elegido, objetivo) {
  return CAMPOS.filter((c) => {
    const a = norm(elegido[c.key] || "");
    const b = norm(objetivo[c.key] || "");
    return a && a === b;
  }).map((c) => c.label);
}

// === ALEATORIO DETERMINISTA ===
function prng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function barajarFijo(arr, semilla = 12345) {
  const r = prng(semilla);
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// === PISTAS POR NIVEL ===
function nivelDePista(pista) {
  const etiqueta = pista.split(":")[0].trim();
  const obtusas = ["Grupo espacial", "Grupo puntual", "Sistema", "Densidad"];
  const claras = ["Raya", "Color", "Fórmula"];
  if (obtusas.includes(etiqueta)) return 1;
  if (claras.includes(etiqueta)) return 3;
  return 2;
}

export function ordenarPistas(objeto, semilla) {
  const niveles = { 1: [], 2: [], 3: [] };
  for (const p of objeto.pistas) niveles[nivelDePista(p)].push(p);

  niveles[1] = barajarFijo(niveles[1], semilla + 1);
  niveles[2] = barajarFijo(niveles[2], semilla + 2);
  niveles[3] = barajarFijo(niveles[3], semilla + 3);

  const tomar = (nivel) => {
    if (niveles[nivel].length) return niveles[nivel].shift();
    for (const n of [1, 2, 3]) if (niveles[n].length) return niveles[n].shift();
    return null;
  };

  const plan = [1, 1, 2, 2, 3];
  const orden = [];
  for (const nivel of plan) {
    const p = tomar(nivel);
    if (p) orden.push(p);
  }
  for (const n of [1, 2, 3]) orden.push(...niveles[n]);
  return orden;
}

export function puntoZoom(semilla) {
  const r = prng(semilla + 99);
  const enRango = () => Math.round(30 + r() * 40);
  return { x: enRango(), y: enRango() };
}

// === OBJETO DEL DÍA ===
function poolDelMes(elementos, semilla) {
  const rocas = elementos.filter((m) => m.tipo === "roca");
  const minerales = elementos.filter((m) => m.tipo === "mineral");

  const populares = [...minerales.slice(0, CORTE_POPULARES), ...rocas];
  const resto = minerales.slice(CORTE_POPULARES);

  const elegidosPop = barajarFijo(populares, semilla).slice(0, N_POPULARES);
  const elegidosResto = barajarFijo(resto, semilla + 1).slice(0, N_RESTO);

  return barajarFijo([...elegidosPop, ...elegidosResto], semilla + 2);
}

export function objetoDelDia(elementos, fecha) {
  const d = new Date(fecha + "T00:00:00Z");
  const anio = d.getUTCFullYear();
  const mes = d.getUTCMonth() + 1;
  const dia = d.getUTCDate();

  const pool = poolDelMes(elementos, anio * 100 + mes);
  return pool[(dia - 1) % pool.length];
}

export function semillaDelDia(fecha) {
  const d = new Date(fecha + "T00:00:00Z");
  return (
    d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate()
  );
}

// === LISTA DE DÍAS ===
export function listaDeDias(partidas) {
  const dias = [];
  const hoy = new Date(fechaHoy() + "T00:00:00Z");
  const inicio = new Date(FECHA_LANZAMIENTO + "T00:00:00Z");

  for (let d = new Date(hoy); d >= inicio; d.setUTCDate(d.getUTCDate() - 1)) {
    const fecha = d.toISOString().slice(0, 10);
    const partida = partidas[fecha];

    let estado = "sin-jugar";
    if (partida) estado = partida.estado;

    dias.push({
      fecha,
      estado,
      guesses: partida ? partida.guesses : [],
    });
  }
  return dias;
}