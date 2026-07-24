export default function StatsPanel({ stats, guesses, gano, sesion, fecha }) {
  const porcentaje =
    stats.jugadas > 0 ? Math.round((stats.ganadas / stats.jugadas) * 100) : 0;

  function textoCompartir() {
    const emojis = guesses
      .map((g) =>
        g.estado === "correct" ? "🟩" : g.estado === "partial" ? "🟨" : "🟥",
      )
      .join("");

    const resultado = gano ? `${guesses.length}/6` : "X/6";
    let texto = `Guess The Geo ${resultado}\n${emojis}`;

    if (sesion) {
      const url = `${window.location.origin}/share/${sesion.user.username}/${fecha}`;
      texto += `\n${url}`;
    }

    return texto;
  }

  function copiar() {
    navigator.clipboard.writeText(textoCompartir());
  }

  return (
    <div className="mt-4 rounded-md p-4 bg-[var(--color-superficie)] border-2">
      <h2 className="text-lg font-semibold mb-3 text-[var(--color-texto)] border-b border-white/40 pb-1">
        Estadísticas
      </h2>

      {/* Cifras principales */}
      <div className="grid grid-cols-4 gap-2 text-center mb-4">
        <div>
          <p className="text-2xl font-semibold text-[var(--color-texto)]">
            {stats.jugadas}
          </p>
          <p className="text-xs text-[var(--color-texto-suave)] uppercase tracking-wide">
            Jugadas
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[var(--color-texto)]">
            {porcentaje}%
          </p>
          <p className="text-xs text-[var(--color-texto-suave)] uppercase tracking-wide">
            Aciertos
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[var(--color-texto)]">
            {stats.racha}
          </p>
          <p className="text-xs text-[var(--color-texto-suave)] uppercase tracking-wide">
            Racha
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[var(--color-texto)]">
            {stats.mejorRacha}
          </p>
          <p className="text-xs text-[var(--color-texto-suave)] uppercase tracking-wide">
            Mejor
          </p>
        </div>
      </div>

      {/* Distribución de victorias por intento */}
      <div className="space-y-1 mb-4">
        {stats.distribucion.map((n, i) => {
          const max = Math.max(...stats.distribucion, 1);
          const ancho = (n / max) * 100;
          return (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-[var(--color-texto)]"
            >
              <span className="w-3">{i + 1}</span>
              <div className="flex-1 bg-white/10 rounded overflow-hidden">
                <div
                  className="bg-[var(--color-verde-borde)] text-white text-right px-2 rounded font-medium"
                  style={{ width: `${Math.max(ancho, 8)}%` }}
                >
                  {n}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={copiar}
        className="w-full bg-[var(--color-verde-borde)] hover:brightness-110 text-white rounded py-2 font-semibold transition"
      >
        Compartir resultado
      </button>
    </div>
  );
}