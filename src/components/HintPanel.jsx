export default function HintPanel({ pistas = [], reveladas = 0 }) {
  const visibles = pistas.slice(0, reveladas);

  return (
    <aside className="w-64 self-start shrink-0">
      <h2 className="text-lg font-semibold mb-2 text-[var(--color-texto)] border-b border-white/40 pb-1">
        Pistas
      </h2>

      {visibles.length === 0 ? (
        <p className="text-sm text-[var(--color-texto-suave)] mt-3">
          Falla un intento para revelar una pista.
        </p>
      ) : (
        <div className="space-y-3 mt-3">
          {visibles.map((pista, i) => (
            <div
              key={i}
              className="rounded-md p-3 bg-[#1e2a3a] border-2 border-dashed border-[var(--color-borde-punteado)]"
            >
              <p className="text-xs text-[var(--color-texto)] opacity-60 mb-0.5">
                Pista {i + 1}:
              </p>
              <p className="text-sm text-[var(--color-texto)] font-medium">
                {pista}
              </p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}