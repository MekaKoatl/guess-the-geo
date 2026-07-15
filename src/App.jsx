import { useState, useEffect } from "react";
import Header from "./components/Header";
import HintPanel from "./components/HintPanel";
import RockViewer from "./components/RockViewer";
import StepTracker from "./components/StepTracker";
import GuessForm from "./components/GuessForm";
import GuessHistory from "./components/GuessHistory";
import Countdown from "./components/Countdown";
import ResultCard from "./components/ResultCard";
import StatsPanel from "./components/StatsPanel";
import { getMinerales } from "./api/minerals";
import {
  guardarPartida,
  cargarPartida,
  cargarPartidas,
  cargarStats,
  registrarResultado,
  fechaHoy,
} from "./api/storage";
import DayList from "./components/DayList";

// === CONFIG ===
const MAX_INTENTOS = 6;
const N_POPULARES = 20;
const N_RESTO = 11;
const CORTE_POPULARES = 40;

const FECHA_LANZAMIENTO = "2026-07-01"; // primer día jugable del juego

const norm = (s) =>
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

function coincidencias(elegido, objetivo) {
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

// === PISTAS POR NIVEL (1=difícil, 2=media, 3=clara) ===
function nivelDePista(pista) {
  const etiqueta = pista.split(":")[0].trim();
  const obtusas = ["Grupo espacial", "Grupo puntual", "Sistema", "Densidad"];
  const claras = ["Raya", "Color", "Fórmula"];
  if (obtusas.includes(etiqueta)) return 1;
  if (claras.includes(etiqueta)) return 3;
  return 2;
}

function ordenarPistas(objeto, semilla) {
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

  const plan = [1, 1, 2, 2, 3]; // reparto de las 5 revelaciones
  const orden = [];
  for (const nivel of plan) {
    const p = tomar(nivel);
    if (p) orden.push(p);
  }
  for (const n of [1, 2, 3]) orden.push(...niveles[n]);
  return orden;
}

function puntoZoom(semilla) {
  const r = prng(semilla + 99);
  const enRango = () => Math.round(30 + r() * 40); // 30..70
  return { x: enRango(), y: enRango() };
}

// === OBJETO DEL DÍA (baraja mensual: 20 populares + 11 del resto) ===
function poolDelMes(elementos, semilla) {
  const rocas = elementos.filter((m) => m.tipo === "roca");
  const minerales = elementos.filter((m) => m.tipo === "mineral");

  const populares = [...minerales.slice(0, CORTE_POPULARES), ...rocas];
  const resto = minerales.slice(CORTE_POPULARES);

  const elegidosPop = barajarFijo(populares, semilla).slice(0, N_POPULARES);
  const elegidosResto = barajarFijo(resto, semilla + 1).slice(0, N_RESTO);

  return barajarFijo([...elegidosPop, ...elegidosResto], semilla + 2);
}

function objetoDelDia(elementos, fecha) {
  const d = new Date(fecha + "T00:00:00Z");
  const anio = d.getUTCFullYear();
  const mes = d.getUTCMonth() + 1;
  const dia = d.getUTCDate();

  const pool = poolDelMes(elementos, anio * 100 + mes);
  return pool[(dia - 1) % pool.length];
}

function semillaDelDia(fecha) {
  const d = new Date(fecha + "T00:00:00Z");
  return (
    d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate()
  );
}

// Lista de días desde el lanzamiento hasta hoy, con el estado de cada uno
function listaDeDias(partidas) {
  const dias = [];
  const hoy = new Date(fechaHoy() + "T00:00:00Z");
  const inicio = new Date(FECHA_LANZAMIENTO + "T00:00:00Z");

  for (let d = new Date(hoy); d >= inicio; d.setUTCDate(d.getUTCDate() - 1)) {
    const fecha = d.toISOString().slice(0, 10);
    const partida = partidas[fecha]; // puede no existir

    let estado = "sin-jugar";
    if (partida) estado = partida.estado; // jugando | ganado | perdido

    dias.push({
      fecha,
      estado, // sin-jugar | jugando | ganado | perdido
      guesses: partida ? partida.guesses : [],
    });
  }
  return dias; // de hoy hacia atrás
}

export default function App() {
  // === ESTADO ===
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [mineral, setMineral] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [estado, setEstado] = useState("jugando"); // jugando | ganado | perdido
  const [stats, setStats] = useState(cargarStats());
  const [fecha, setFecha] = useState(fechaHoy()); // día que se está jugando
  const [vista, setVista] = useState("juego"); // juego | listado

  // === CARGA INICIAL (datos + objeto del día + partida guardada) ===
  useEffect(() => {
    getMinerales()
      .then((d) => {
        setDatos(d);
        const obj = objetoDelDia(d.minerales, fecha);
        const semilla = semillaDelDia(fecha);
        setMineral({
          ...obj,
          pistas: ordenarPistas(obj, semilla),
          origen: puntoZoom(semilla),
        });

        // Restaurar la partida de ESE día (si existe)
        const guardada = cargarPartida(fecha);
        setGuesses(guardada ? guardada.guesses : []);
        setEstado(guardada ? guardada.estado : "jugando");
      })
      .catch(() => setError("No se pudieron cargar los minerales."));
  }, [fecha]); // se vuelve a ejecutar si cambia la fecha

  if (error) {
    return <p className="p-6 text-center text-red-700">{error}</p>;
  }
  if (!datos || !mineral) {
    return <p className="p-6 text-center text-neutral-500">Cargando…</p>;
  }

  const fallos = guesses.length;

  // === PROCESAR INTENTO ===
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

    const nuevo = {
      nombre: respuesta,
      estado: estadoIntento,
      similares,
      imagen: elegido?.imagen || "",
    };
    const lista = [...guesses, nuevo];
    setGuesses(lista);

    let nuevoEstado = estado;
    if (acierto) {
      nuevoEstado = "ganado";
    } else if (lista.length >= MAX_INTENTOS) {
      nuevoEstado = "perdido";
    }
    setEstado(nuevoEstado);
    guardarPartida(fecha, lista, nuevoEstado);

    // Solo la partida de HOY cuenta para las estadísticas y la racha
    if (nuevoEstado !== "jugando" && fecha === fechaHoy()) {
      setStats(registrarResultado(nuevoEstado === "ganado", lista.length));
    }
  }

  function irADia(nuevaFecha) {
    setFecha(nuevaFecha); // dispara la recarga del useEffect
    setVista("juego");
  }

  // === VISTA DE LISTADO (días anteriores) ===
  if (vista === "listado") {
    return (
      <div className="min-h-screen bg-white text-neutral-900 p-6">
        <DayList
          dias={listaDeDias(cargarPartidas())}
          hoy={fechaHoy()}
          onElegirDia={irADia}
          onVolver={() => {
            setFecha(fechaHoy());
            setVista("juego");
          }}
        />
      </div>
    );
  }

  // === RENDER (3 columnas: pistas | juego | buscador + intentos) ===
  return (
    <div className="min-h-screen bg-white text-neutral-900 p-6">
      <div className="flex justify-center gap-6">
        <HintPanel pistas={mineral.pistas} reveladas={fallos} />

        <main className="w-full max-w-md">
          <Header />
          <button
            onClick={() => setVista("listado")}
            className="text-sm underline mb-2"
          >
            Ver días anteriores
          </button>
          <RockViewer
            imagen={mineral.imagen}
            tipo={mineral.tipo}
            fallos={fallos}
            maxIntentos={MAX_INTENTOS}
            origen={mineral.origen}
            revelado={estado !== "jugando"}
          />
          <StepTracker guesses={guesses} maxIntentos={MAX_INTENTOS} />

          {estado !== "jugando" && (
            <>
              <ResultCard
                objeto={mineral}
                estado={estado}
                intentos={guesses.length}
              />
              <StatsPanel
                stats={stats}
                guesses={guesses}
                gano={estado === "ganado"}
              />
            </>
          )}

          <Countdown />
        </main>

        <div className="w-80 shrink-0 self-start space-y-4">
          {estado === "jugando" && (
            <GuessForm
              onGuess={manejarIntento}
              opciones={datos.nombres}
              usados={guesses.map((g) => g.nombre)}
            />
          )}
          <GuessHistory guesses={guesses} />
        </div>
      </div>
    </div>
  );
}
