export default function RockViewer({
  imagen,
  fallos = 0,
  maxIntentos = 6,
  origen = { x: 50, y: 50 }, // punto del zoom (%), lo pasa App
  revelado = false,          // si el juego terminó, mostrar imagen completa
}) {
  const paso = fallos / maxIntentos;
  const zoom = revelado ? 1 : Math.max(1, 3 - paso * 2); // completa al terminar

  return (
    <div className="aspect-square w-full bg-neutral-300 rounded overflow-hidden">
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
    </div>
  );
}