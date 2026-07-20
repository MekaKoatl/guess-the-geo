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

    // Si hay sesión, añadir el enlace público
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
    <div className="mt-4 rounded border border-neutral-300 p-4">
      <h2 className="font-medium mb-3">Estadísticas</h2>

      <div className="grid grid-cols-4 gap-2 text-center mb-4">
        <div>
          <p className="text-xl font-medium">{stats.jugadas}</p>
          <p className="text-xs text-neutral-600">Jugadas</p>
        </div>
        <div>
          <p className="text-xl font-medium">{porcentaje}%</p>
          <p className="text-xs text-neutral-600">Aciertos</p>
        </div>
        <div>
          <p className="text-xl font-medium">{stats.racha}</p>
          <p className="text-xs text-neutral-600">Racha</p>
        </div>
        <div>
          <p className="text-xl font-medium">{stats.mejorRacha}</p>
          <p className="text-xs text-neutral-600">Mejor</p>
        </div>
      </div>

      {/* Distribución de victorias por intento */}
      <div className="space-y-1 mb-4">
        {stats.distribucion.map((n, i) => {
          const max = Math.max(...stats.distribucion, 1);
          const ancho = (n / max) * 100;
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-3">{i + 1}</span>
              <div className="flex-1 bg-neutral-100 rounded">
                <div
                  className="bg-green-500 text-white text-right px-1 rounded"
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
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 font-medium"
      >
        Compartir resultado
      </button>
    </div>
  );
}
