import { useState } from "react";

const NOMBRES_MES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// === HELPER: extrae {anio, mes} de "YYYY-MM-DD" ===
function anioMesDe(fecha) {
  const [anio, mes] = fecha.split("-").map(Number);
  return { anio, mes };
}

export default function DayList({ dias, hoy, onElegirDia, onVolver }) {
  const etiqueta = {
    "sin-jugar": "Aún sin jugar",
    jugando: "Incompleto",
    ganado: "Victoria",
    perdido: "Derrota",
  };

  const colorEtiqueta = {
    "sin-jugar": "text-[var(--color-texto-suave)]",
    jugando: "text-[var(--color-amarillo-borde)]",
    ganado: "text-[var(--color-verde-borde)]",
    perdido: "text-[var(--color-rojo-borde)]",
  };

  // === LÍMITES DE NAVEGACIÓN ===
  // dias[0] es el más reciente (hoy), el último es el más antiguo (lanzamiento)
  const limiteReciente = anioMesDe(dias[0]?.fecha || hoy);
  const limiteAntiguo = anioMesDe(dias[dias.length - 1]?.fecha || hoy);

  // === MES QUE SE ESTÁ VIENDO ===
  const [{ anio, mes }, setAnioMes] = useState(anioMesDe(hoy));

  const diasDelMes = dias.filter((d) => {
    const am = anioMesDe(d.fecha);
    return am.anio === anio && am.mes === mes;
  });

  function enLimiteSuperior() {
    return (
      anio > limiteReciente.anio ||
      (anio === limiteReciente.anio && mes >= limiteReciente.mes)
    );
  }
  function enLimiteInferior() {
    return (
      anio < limiteAntiguo.anio ||
      (anio === limiteAntiguo.anio && mes <= limiteAntiguo.mes)
    );
  }

  function mesAnterior() {
    if (enLimiteInferior()) return;
    setAnioMes(mes === 1 ? { anio: anio - 1, mes: 12 } : { anio, mes: mes - 1 });
  }
  function mesSiguiente() {
    if (enLimiteSuperior()) return;
    setAnioMes(mes === 12 ? { anio: anio + 1, mes: 1 } : { anio, mes: mes + 1 });
  }

  // Elegir un día al azar (dentro del mes que se está viendo)
  function diaAleatorio() {
    const disponibles = diasDelMes.filter((d) => d.estado === "sin-jugar");
    if (disponibles.length === 0) return;
    const elegido = disponibles[Math.floor(Math.random() * disponibles.length)];
    onElegirDia(elegido.fecha);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl text-center mb-6">Días anteriores</h1>

      {/* Volver a hoy */}
      <button
        onClick={onVolver}
        className="w-full mb-4 py-3 rounded-md bg-[var(--color-borde-punteado)]/20 hover:bg-[var(--color-borde-punteado)]/30 border-2 border-dashed border-[var(--color-borde-punteado)] text-[var(--color-texto)] font-medium transition"
      >
        Regresa al juego del día de hoy
      </button>

      {/* Leyenda */}
      <div className="flex justify-center gap-4 mb-4 text-sm text-[var(--color-texto-suave)]">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-xs">
            ?
          </span>
          Sin jugar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-[var(--color-rojo-borde)]" />
          Incorrecto
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-[var(--color-verde-borde)]" />
          Correcto
        </span>
      </div>

      {/* Lista de días del mes */}
      <div className="space-y-2">
        {diasDelMes.map((d) => (
          <div
            key={d.fecha}
            className="flex items-center gap-3 rounded-md p-2 bg-[var(--color-superficie2)] border border-white/10"
          >
            {/* Botón "Jugar día" */}
            <button
              onClick={() => onElegirDia(d.fecha)}
              className="text-sm text-left flex-1 px-3 py-2 rounded bg-[var(--color-fondo-azul-oscuro)] hover:bg-[var(--color-fondo-azul-claro)]/70 text-[var(--color-texto)] transition"
            >
              Jugar día {d.fecha}
              {d.fecha === hoy && (
                <span className="text-[var(--color-borde-punteado)] ml-1">
                  (hoy)
                </span>
              )}
            </button>

            {/* Cuadraditos de intentos */}
            <div className="flex gap-1">
              {Array.from({ length: 6 }).map((_, i) => {
                const g = d.guesses[i];
                if (!g) {
                  return (
                    <span
                      key={i}
                      className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-[var(--color-texto-suave)]"
                    >
                      ?
                    </span>
                  );
                }
                const color =
                  g.estado === "correct"
                    ? "bg-[var(--color-verde-borde)]"
                    : g.estado === "partial"
                      ? "bg-[var(--color-amarillo-borde)]"
                      : "bg-[var(--color-rojo-borde)]";
                return (
                  <span key={i} className={`w-6 h-6 rounded ${color}`} />
                );
              })}
            </div>

            {/* Etiqueta de estado */}
            <span
              className={`text-sm w-24 text-center font-medium ${colorEtiqueta[d.estado]}`}
            >
              {etiqueta[d.estado]}
            </span>
          </div>
        ))}
      </div>

      {/* Navegación de mes */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={mesAnterior}
          disabled={enLimiteInferior()}
          className="w-10 h-10 rounded-md bg-[var(--color-borde-punteado)]/20 hover:bg-[var(--color-borde-punteado)]/30 border-2 border-dashed border-[var(--color-borde-punteado)] text-[var(--color-texto)] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ‹
        </button>

        <span className="px-4 py-2 min-w-44 text-center rounded-md bg-[var(--color-superficie2)] border border-white/10 text-[var(--color-texto)] font-medium">
          {NOMBRES_MES[mes - 1]} - {anio}
        </span>

        <button
          onClick={mesSiguiente}
          disabled={enLimiteSuperior()}
          className="w-10 h-10 rounded-md bg-[var(--color-borde-punteado)]/20 hover:bg-[var(--color-borde-punteado)]/30 border-2 border-dashed border-[var(--color-borde-punteado)] text-[var(--color-texto)] font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>

      {/* Jugar día aleatorio (dentro del mes visible) */}
      <button
        onClick={diaAleatorio}
        className="w-full mt-4 py-3 rounded-md bg-[var(--color-borde-punteado)]/20 hover:bg-[var(--color-borde-punteado)]/30 border-2 border-dashed border-[var(--color-borde-punteado)] text-[var(--color-texto)] font-medium transition"
      >
        Jugar día aleatorio
      </button>
    </div>
  );
}