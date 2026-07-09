import { useState, useEffect } from "react";
import Header from "./components/Header";
import HintPanel from "./components/HintPanel";
import RockViewer from "./components/RockViewer";
import StepTracker from "./components/StepTracker";
import GuessForm from "./components/GuessForm";
import GuessHistory from "./components/GuessHistory";
import { getMinerales } from "./api/minerals";

// --- Config del juego ---
const MAX_INTENTOS = 6;
const N_POPULARES = 20;      // objetos populares por mes
const N_RESTO = 11;          // objetos del resto por mes
const CORTE_POPULARES = 40;  // "populares" = top 40 minerales + todas las rocas

// Normaliza texto para comparar (sin tildes, minúsculas)
const norm = (s) =>
  s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// --- Comparación para el estado "parcial" (amarillo) ---
const CAMPOS = [
  { key: "familia", label: "Misma familia" },
  { key: "color", label: "Mismo color" },
  { key: "sistema", label: "Mismo sistema cristalino" },
  { key: "rocaTipo", label: "Mismo tipo de roca" },
  { key: "composicion", label: "Composición parecida" },
];

function coincidencias(elegido, objetivo) {
  return CAMPOS.filter((c) => {
    const a = norm(elegido[c.key] || "");
    const b = norm(objetivo[c.key] || "");
    return a && a === b; // ambos no vacíos e iguales
  }).map((c) => c.label);
}

// --- Aleatorio determinista (misma semilla = misma secuencia) ---
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

// --- Baraja mensual: 31 objetos (20 populares + 11 del resto) ---
// La semilla depende del mes, así que cada mes cambia el reparto.
function poolDelMes(elementos, semilla) {
  const rocas = elementos.filter((m) => m.tipo === "roca");
  const minerales = elementos.filter((m) => m.tipo === "mineral");

  const populares = [...minerales.slice(0, CORTE_POPULARES), ...rocas];
  const resto = minerales.slice(CORTE_POPULARES);

  const elegidosPop = barajarFijo(populares, semilla).slice(0, N_POPULARES);
  const elegidosResto = barajarFijo(resto, semilla + 1).slice(0, N_RESTO);

  return barajarFijo([...elegidosPop, ...elegidosResto], semilla + 2);
}

// --- Objeto del día (mismo para todos, cambia cada día y cada mes) ---
function objetoDelDia(elementos) {
  const hoy = new Date();
  const anio = hoy.getUTCFullYear();
  const mes = hoy.getUTCMonth() + 1;
  const dia = hoy.getUTCDate();

  const pool = poolDelMes(elementos, anio * 100 + mes);
  return pool[(dia - 1) % pool.length];
}

export default function App() {
  // --- Estado ---
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [mineral, setMineral] = useState(null); // objetivo del día
  const [guesses, setGuesses] = useState([]);
  const [estado, setEstado] = useState("jugando"); // jugando | ganado | perdido

  // --- Carga inicial: datos + objeto del día (una sola vez) ---
  useEffect(() => {
    getMinerales()
      .then((d) => {
        setDatos(d);
        setMineral(objetoDelDia(d.minerales));
      })
      .catch(() => setError("No se pudieron cargar los minerales."));
  }, []);

  if (error) {
    return <p className="p-6 text-center text-red-700">{error}</p>;
  }
  if (!datos || !mineral) {
    return <p className="p-6 text-center text-neutral-500">Cargando…</p>;
  }

  const fallos = guesses.length;

  // --- Procesa cada intento (acierto / parcial / fallo + fin de juego) ---
  function manejarIntento(respuesta) {
    if (estado !== "jugando") return;

    const acierto = norm(respuesta) === norm(mineral.nombre);
    const elegido = datos.minerales.find(
      (m) => norm(m.nombre) === norm(respuesta),
    );

    let estadoIntento = "wrong";
    let similares = [];

    if (acierto) {
      estadoIntento = "correct";
    } else if (elegido) {
      similares = coincidencias(elegido, mineral);
      if (similares.length > 0) estadoIntento = "partial";
    }

    const nuevo = { nombre: respuesta, estado: estadoIntento, similares };
    const lista = [...guesses, nuevo];
    setGuesses(lista);

    if (acierto) {
      setEstado("ganado");
    } else if (lista.length >= MAX_INTENTOS) {
      setEstado("perdido");
    }
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <HintPanel pistas={mineral.pistas} reveladas={fallos} />

      <main className="max-w-xl mx-auto pt-6 px-4">
        <Header />
        <RockViewer
          imagen={mineral.imagen}
          fallos={fallos}
          maxIntentos={MAX_INTENTOS}
        />
        <StepTracker guesses={guesses} maxIntentos={MAX_INTENTOS} />

        {estado === "jugando" && (
          <GuessForm onGuess={manejarIntento} opciones={datos.nombres} />
        )}

        {estado === "ganado" && (
          <p className="mt-4 text-center text-green-700 font-medium">
            ¡Correcto! Era {mineral.nombre}.
          </p>
        )}
        {estado === "perdido" && (
          <p className="mt-4 text-center text-red-700 font-medium">
            Se acabaron los intentos. Era {mineral.nombre}.
          </p>
        )}

        <GuessHistory guesses={guesses} />
      </main>
    </div>
  );
}