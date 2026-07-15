export default function DayList({ dias, hoy, onElegirDia, onVolver }) {
  const etiqueta = {
    "sin-jugar": "Aún sin jugar",
    jugando: "Incompleto",
    ganado: "Victoria",
    perdido: "Derrota",
  };

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={onVolver}
        className="mb-4 w-full bg-blue-200 hover:bg-blue-300 rounded py-2"
      >
        Regresa al juego del día de hoy
      </button>

      <div className="space-y-2">
        {dias.map((d) => (
          <div
            key={d.fecha}
            className="flex items-center gap-3 border border-neutral-300 rounded p-2"
          >
            <button
              onClick={() => onElegirDia(d.fecha)}
              className="bg-neutral-100 hover:bg-neutral-200 rounded px-3 py-2 text-sm text-left flex-1"
            >
              Jugar día {d.fecha}
              {d.fecha === hoy && " (hoy)"}
            </button>

            {/* Cuadraditos de intentos (placeholder simple por ahora) */}
            <div className="flex gap-1">
              {Array.from({ length: 6 }).map((_, i) => {
                const g = d.guesses[i];
                const color = !g
                  ? "bg-neutral-300"
                  : g.estado === "correct"
                    ? "bg-green-500"
                    : g.estado === "partial"
                      ? "bg-yellow-400"
                      : "bg-red-500";
                return <span key={i} className={`w-4 h-4 rounded ${color}`} />;
              })}
            </div>

            <span className="text-sm w-24 text-center">
              {etiqueta[d.estado]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}