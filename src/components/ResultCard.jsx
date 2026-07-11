export default function ResultCard({ objeto, estado, intentos }) {
  const gano = estado === "ganado";

  const estilo = gano
    ? "bg-green-100 border-green-500"
    : "bg-red-100 border-red-500";

  return (
    <div className={`mt-4 rounded border-2 p-4 ${estilo}`}>
      <p className="text-sm font-medium">
        {gano
          ? `¡Correcto! Lo lograste en ${intentos} ${intentos === 1 ? "intento" : "intentos"}.`
          : "Se acabaron los intentos."}
      </p>

      <h2 className="text-2xl mt-1 mb-3">{objeto.nombre}</h2>

      {/* Ficha completa del objeto */}
      <ul className="text-sm space-y-1">
        {objeto.pistas.map((pista, i) => {
          const [etiqueta, ...resto] = pista.split(":");
          return (
            <li key={i} className="flex justify-between gap-3 border-b border-black/10 pb-1">
              <span className="text-neutral-600">{etiqueta}</span>
              <span className="text-right font-medium">{resto.join(":").trim()}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}