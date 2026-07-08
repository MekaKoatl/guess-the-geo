export default function StepTracker({ intentoActual = 0, maxIntentos = 6 }) {
  const hexagono =
    '[clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]'

  return (
    <div className="flex justify-center gap-3 my-5">
      {Array.from({ length: maxIntentos }).map((_, i) => {
        const usado = i < intentoActual
        const actual = i === intentoActual

        const color = usado
          ? 'bg-red-200 text-red-700'      // ya fallado
          : actual
          ? 'bg-neutral-300 text-black'    // intento actual
          : 'bg-neutral-200 text-neutral-400' // aún no llega

        return (
          <span
            key={i}
            className={`w-12 h-12 grid place-items-center text-lg ${color} ${hexagono}`}
          >
            {i + 1}
          </span>
        )
      })}
    </div>
  )
}