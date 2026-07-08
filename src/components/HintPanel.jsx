export default function HintPanel({ pistas = [], reveladas = 0 }) {
  const visibles = pistas.slice(0, reveladas)

  return (
    <aside className="absolute left-6 top-20 w-64 bg-neutral-200 rounded p-4">
      <h1>Pistas</h1>
      {visibles.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Falla un intento para revelar una pista.
        </p>
      ) : (
        <ul className="list-disc pl-5 space-y-2 text-sm">
          {visibles.map((pista, i) => (
            <li key={i}>{pista}</li>
          ))}
        </ul>
      )}
    </aside>
  )
}