import { useState, useEffect } from "react";
import { getMinerales } from "../api/minerals";
import {
  guardarPartida,
  cargarPartida,
  cargarStats,
  registrarResultado,
  fechaHoy,
} from "../api/storage";
import {
  cargarStatsBackend,
  cargarPartidasBackend,
  guardarPartidaBackend,
  registrarResultadoBackend,
} from "../api/backend";
import {
  MAX_INTENTOS,
  norm,
  coincidencias,
  ordenarPistas,
  puntoZoom,
  objetoDelDia,
  semillaDelDia,
} from "../logica/juego";

export function usePartida(fecha, sesion) {
  // === ESTADO ===
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [mineral, setMineral] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [estado, setEstado] = useState("jugando");
  const [stats, setStats] = useState(cargarStats());

  // === CARGA INICIAL ===
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

        const guardada = cargarPartida(fecha);
        setGuesses(guardada ? guardada.guesses : []);
        setEstado(guardada ? guardada.estado : "jugando");
      })
      .catch(() => setError("No se pudieron cargar los minerales."));
  }, [fecha]);

  // === SINCRONIZAR CON BACKEND ===
  useEffect(() => {
    if (!sesion) return;

    cargarStatsBackend(sesion.token)
      .then((s) => setStats(s))
      .catch((e) => console.log("Error stats backend:", e.message));

    cargarPartidasBackend(sesion.token)
      .then((partidas) => {
        const deHoy = partidas.find((p) => p.fecha === fecha);
        if (deHoy) {
          setGuesses(deHoy.guesses);
          setEstado(deHoy.estado);
        } else {
          setGuesses([]);
          setEstado("jugando");
        }
      })
      .catch((e) => console.log("Error partidas backend:", e.message));
  }, [sesion, fecha]);

  // === PROCESAR INTENTO ===
  function intentar(respuesta) {
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

    const terminada = nuevoEstado !== "jugando" && fecha === fechaHoy();

    if (sesion) {
      guardarPartidaBackend(sesion.token, fecha, lista, nuevoEstado).catch((e) =>
        console.log("Error guardando partida:", e.message),
      );

      if (terminada) {
        registrarResultadoBackend(
          sesion.token,
          nuevoEstado === "ganado",
          lista.length,
        )
          .then((s) => setStats(s))
          .catch((e) => console.log("Error registrando stats:", e.message));
      }
    } else {
      guardarPartida(fecha, lista, nuevoEstado);
      if (terminada) {
        setStats(registrarResultado(nuevoEstado === "ganado", lista.length));
      }
    }
  }

  return { datos, error, mineral, guesses, estado, stats, intentar };
}