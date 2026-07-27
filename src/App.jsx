import { useState } from "react";
import HintPanel from "./components/HintPanel";
import RockViewer from "./components/RockViewer";
import StepTracker from "./components/StepTracker";
import GuessForm from "./components/GuessForm";
import GuessHistory from "./components/GuessHistory";
import Countdown from "./components/Countdown";
import ResultCard from "./components/ResultCard";
import StatsPanel from "./components/StatsPanel";
import AuthPanel from "./components/AuthPanel";
import DayList from "./components/DayList";
import SharePage from "./components/SharePage";
import LayoutJuego from "./components/LayoutJuego";
import BarraSuperior from "./components/BarraSuperior";
import Cargando from "./components/Cargando";
import { cargarPartidas, fechaHoy } from "./api/storage";
import { useSesion } from "./hooks/useSesion";
import { usePartida } from "./hooks/usePartida";
import { MAX_INTENTOS, listaDeDias } from "./logica/juego";

export default function App() {
  // === ESTADO ===
  const [fecha, setFecha] = useState(fechaHoy());
  const [vista, setVista] = useState("juego");
  const [mostrarAuth, setMostrarAuth] = useState(false);
  const { sesion, iniciar, cerrar: cerrarSesion } = useSesion();
  const { datos, error, mineral, guesses, estado, stats, intentar } =
    usePartida(fecha, sesion);

  // Detectar si la URL es /share/:username/:fecha
  const partesURL = window.location.pathname.split("/").filter(Boolean);
  const esVistaCompartir = partesURL[0] === "share" && partesURL.length >= 3;

  async function alIniciarSesion(token, user) {
    await iniciar(token, user);
    setMostrarAuth(false);
  }

  function irADia(nuevaFecha) {
    setFecha(nuevaFecha);
    setVista("juego");
  }

  // === VISTA DE COMPARTIR (URL /share/:username/:fecha) ===
  if (esVistaCompartir) {
    return (
      <SharePage
        username={partesURL[1]}
        fecha={partesURL[2]}
        onVolver={() => {
          window.history.pushState({}, "", "/");
          window.location.reload();
        }}
      />
    );
  }

  if (error) {
    return <p className="p-6 text-center text-red-700">{error}</p>;
  }
  if (!datos || !mineral) {
    return <Cargando mensaje="Cargando minerales…" />;
  }

  // === VISTA DE LISTADO (días anteriores) ===
  if (vista === "listado") {
    return (
      <div className="min-h-screen p-6">
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

  // === RENDER (vista de juego) ===
  const fallos = guesses.length;

  const bloqueImagen = (
    <RockViewer
      imagen={mineral.imagen}
      tipo={mineral.tipo}
      fallos={fallos}
      maxIntentos={MAX_INTENTOS}
      origen={mineral.origen}
      revelado={estado !== "jugando"}
    />
  );
  const bloqueHexagonos = (
    <StepTracker guesses={guesses} maxIntentos={MAX_INTENTOS} />
  );
  const bloqueBuscador = estado === "jugando" && (
    <GuessForm
      onGuess={intentar}
      opciones={datos.nombres}
      usados={guesses.map((g) => g.nombre)}
    />
  );
  const bloqueIntentos = <GuessHistory guesses={guesses} />;
  const bloquePistas = <HintPanel pistas={mineral.pistas} reveladas={fallos} />;
  const bloqueResultado = estado !== "jugando" && (
    <>
      <ResultCard objeto={mineral} estado={estado} intentos={guesses.length} />
      <StatsPanel
        stats={stats}
        guesses={guesses}
        gano={estado === "ganado"}
        sesion={sesion}
        fecha={fecha}
      />
    </>
  );
  const bloqueCountdown = <Countdown />;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <BarraSuperior
        sesion={sesion}
        onCerrarSesion={cerrarSesion}
        onCuentaEliminada={cerrarSesion}
        onAbrirAuth={() => setMostrarAuth(true)}
        onVerListado={() => setVista("listado")}
      />

      <LayoutJuego
        imagen={bloqueImagen}
        hexagonos={bloqueHexagonos}
        buscador={bloqueBuscador}
        intentos={bloqueIntentos}
        pistas={bloquePistas}
        resultado={bloqueResultado}
        countdown={bloqueCountdown}
      />

      {mostrarAuth && (
        <AuthPanel
          onSesion={alIniciarSesion}
          onCerrar={() => setMostrarAuth(false)}
        />
      )}
    </div>
  );
}