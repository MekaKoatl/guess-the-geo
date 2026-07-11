export default function GuessCard({ nombre, estado, similares = [], imagen }) {
  // El color del fondo indica el resultado (sin necesidad de ✕/✓)
  const estilo =
    estado === "correct"
      ? "bg-green-200 border-green-500"
      : estado === "partial"
        ? "bg-yellow-100 border-yellow-500"
        : estado === "wrong"
          ? "bg-red-200 border-red-500"
          : "bg-neutral-200 border-neutral-300";

  return (
    <div className="flex overflow-hidden rounded h-22">
      {/* Mitad izquierda: imagen */}
      <div className="w-1/3 bg-neutral-400 shrink-0">
        {imagen && (
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Derecha: nombre + coincidencias debajo */}
      <div
        className={`flex-1 border-2 px-3 py-2 flex flex-col justify-center ${estilo}`}
      >
        <p className="text-lg leading-tight truncate">{nombre}</p>

        {estado === "partial" && similares.length > 0 && (
          <p className="text-[11px] text-yellow-700 mt-1">
            {similares.join(" ◆ ")}
          </p>
        )}
      </div>
    </div>
  );
}
