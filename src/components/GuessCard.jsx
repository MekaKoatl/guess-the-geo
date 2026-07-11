export default function GuessCard({ nombre, estado, similares = [], imagen }) {
  const fondo =
    estado === 'partial' ? 'bg-yellow-100 border border-yellow-400' : 'bg-neutral-200'

  return (
    <div className={`${fondo} rounded p-4 flex flex-col items-center gap-2`}>
      <div className="w-16 h-16 rounded overflow-hidden bg-neutral-100">
        {imagen && (
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {estado === 'wrong' && <span className="text-red-500 text-2xl">✕</span>}
      {estado === 'correct' && <span className="text-green-600 text-2xl">✓</span>}
      {estado === 'partial' && <span className="w-8 h-1.5 bg-yellow-400 rounded" />}

      <span className="text-sm">{nombre}</span>

     
      {estado === 'partial' && similares.length > 0 && (
        <ul className="text-xs text-yellow-700 text-center">
          {similares.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  )
}