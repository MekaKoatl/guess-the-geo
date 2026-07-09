export default function StepTracker({ guesses = [], maxIntentos = 6 }) {
  const hexagono =
    '[clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]'

  return (
    <div className="flex justify-center gap-3 my-5">
      {Array.from({ length: maxIntentos }).map((_, i) => {
        const intento = guesses[i]        // puede existir o no
        const actual = i === guesses.length

        let color = 'bg-neutral-200 text-neutral-400' // futuro
        if (intento?.estado === 'correct') color = 'bg-green-200 text-green-700'
        else if (intento?.estado === 'partial') color = 'bg-yellow-200 text-yellow-700'
        else if (intento?.estado === 'wrong') color = 'bg-red-200 text-red-700'
        else if (actual) color = 'bg-neutral-300 text-black'

        return (
          <span key={i} className={`w-12 h-12 grid place-items-center text-lg ${color} ${hexagono}`}>
            {i + 1}
          </span>
        )
      })}
    </div>
  )
}