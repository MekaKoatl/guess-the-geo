export default function ResultCard({ objeto, estado, intentos }) {
  const gano = estado === "ganado";

  const estilo = gano
    ? {
        fondo: "bg-[var(--color-verde-suave)]",
        borde: "border-[var(--color-verde-borde)]",
      }
    : {
        fondo: "bg-[var(--color-rojo-suave)]",
        borde: "border-[var(--color-rojo-borde)]",
      };

  return (
    <div
      className={`mt-4 rounded-md border-2 p-4 text-[var(--color-texto-oscuro)] ${estilo.fondo} ${estilo.borde}`}
    >
      <p className="text-sm font-medium">
        {gano
          ? `¡Correcto! Lo lograste en ${intentos} ${intentos === 1 ? "intento" : "intentos"}.`
          : "Se acabaron los intentos."}
      </p>

      <h2 className="text-2xl mt-1 mb-3 text-[var(--color-texto-oscuro)]">
        {objeto.nombre}
      </h2>

      {/* Ficha completa del objeto */}
      <ul className="text-sm space-y-1">
        {objeto.pistas.map((pista, i) => {
          const [etiqueta, ...resto] = pista.split(":");
          return (
            <li
              key={i}
              className="flex justify-between gap-3 border-b border-black/15 pb-1"
            >
              <span className="opacity-70">{etiqueta}</span>
              <span className="text-right font-medium">
                {resto.join(":").trim()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}