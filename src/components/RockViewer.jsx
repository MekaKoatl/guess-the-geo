export default function RockViewer({
  imagen,
  fallos = 0,
  maxIntentos = 6,
  origen = { x: 50, y: 50 }, // punto del zoom (%). Luego será random.
}) {
  const paso = fallos / maxIntentos           // 0 → 1
  const blur = Math.max(0, 12 - paso * 12)     // 12px → 0px
  const zoom = Math.max(1, 3 - paso * 2)       // 3x  → 1x

  return (
    <div className="aspect-square w-full bg-neutral-300 rounded overflow-hidden">
      {imagen ? (
        <img
          src={imagen}
          alt="Roca a adivinar"
          className="w-full h-full object-cover transition-all duration-500"
          style={{
            filter: `blur(${blur}px)`,
            transform: `scale(${zoom})`,
            transformOrigin: `${origen.x}% ${origen.y}%`,
          }}
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-neutral-500 text-sm">
          (sin imagen todavía)
        </div>
      )}
    </div>
  )
}