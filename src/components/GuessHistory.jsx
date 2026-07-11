import GuessCard from './GuessCard'

export default function GuessHistory({ guesses = [] }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-5">
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
  )
}