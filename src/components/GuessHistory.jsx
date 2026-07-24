import GuessCard from './GuessCard'

export default function GuessHistory({ guesses = [] }) {
  return (
    <aside className="self-start">
      {guesses.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3 text-[var(--color-texto)]">Intentos</h2>
          <div className="space-y-3">
            {guesses.map((g, i) => (
              <GuessCard
                key={i}
                nombre={g.nombre}
                estado={g.estado}
                similares={g.similares}
                imagen={g.imagen}
              />
            ))}
          </div>
        </>
      )}
    </aside>
  )
}