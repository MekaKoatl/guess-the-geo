export default function RockViewer({
  imagen,
  tipo,                      // 'mineral' o 'roca'
  fallos = 0,
  maxIntentos = 6,
  origen = { x: 50, y: 50 },
  revelado = false,          // si el juego terminó, mostrar imagen completa
}) {
  const paso = fallos / maxIntentos;
  const zoom = revelado ? 1 : Math.max(1, 10 - paso * 9);

  const etiqueta = tipo === "roca" ? "Roca" : "Mineral";

  return (
    <div className="relative aspect-square w-full bg-neutral-300 rounded overflow-hidden">
      {imagen ? (
        <img
          src={imagen}
          alt="Objeto a adivinar"
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: `${origen.x}% ${origen.y}%`,
          }}
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-neutral-500 text-sm">
          (sin imagen)
        </div>
      )}

      {/* Etiqueta de tipo, siempre visible */}
  <span className="absolute top-3 left-3 bg-[#0f1a2a]/85 text-[var(--color-texto)] text-xs font-semibold px-3 py-1.5 rounded-md border border-[var(--color-borde-punteado)]/40 backdrop-blur-sm">
        Tipo: {etiqueta}
      </span>
    </div>
  );
}