export default function GuessCard({ nombre, estado, similares = [], imagen }) {
  // Fondo, borde y color de texto según estado
  const estilo =
    estado === "correct"
      ? {
          fondo: "bg-[var(--color-verde-suave)]",
          borde: "border-[var(--color-verde-borde)]",
        }
      : estado === "partial"
        ? {
            fondo: "bg-[var(--color-amarillo-suave)]",
            borde: "border-[var(--color-amarillo-borde)]",
          }
        : {
            fondo: "bg-[var(--color-rojo-suave)]",
            borde: "border-[var(--color-rojo-borde)]",
          };

  return (
    <div className="flex overflow-hidden rounded-md h-24 shadow-sm">
      {/* Imagen a la izquierda */}
      <div className="w-1/3 bg-neutral-800 shrink-0">
        {imagen && (
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Derecha: nombre + coincidenias, todo centrado vertical */}
      <div
        className={`flex-1 border- px-3 py-2 flex flex-col justify-center text-[var(--color-texto-oscuro)] ${estilo.fondo} ${estilo.borde}`}
      >
        <p className="text-lg leading-tight truncate">{nombre}</p>

        {estado === "partial" && similares.length > 0 && (
          <p className="text-xs opacity-75 mt-0.5">
            {similares.join(" ◆ ")}
          </p>
        )}
      </div>
    </div>
  );
}