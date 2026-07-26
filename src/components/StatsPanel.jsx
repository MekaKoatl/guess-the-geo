import { useState } from "react";

export default function StatsPanel({ stats, guesses, gano, sesion, fecha }) {
  const porcentaje =
    stats.jugadas > 0 ? Math.round((stats.ganadas / stats.jugadas) * 100) : 0;

  const [copiado, setCopiado] = useState(false);

  function textoCompartir() {
    const emojis = guesses
      .map((g) =>
        g.estado === "correct" ? "🟩" : g.estado === "partial" ? "🟨" : "🟥",
      )
      .join("");

    // Línea 1: título con la fecha
    const lineas = [`Mineral o Roca del día ${fecha}`];

    // Línea 2: resultado
    if (gano) {
      const n = guesses.length;
      lineas.push(`¡Lo adiviné en ${n} ${n === 1 ? "intento" : "intentos"}!`);
    } else {
      lineas.push("No lo conseguí esta vez 😔");
    }

    // Línea 3: racha y promedio (solo con sesión y si hay stats)
    if (sesion && stats.jugadas > 0) {
      const totalVictorias = stats.distribucion.reduce((a, b) => a + b, 0);
      let promedio = "—";
      if (totalVictorias > 0) {
        const suma = stats.distribucion.reduce(
          (acc, veces, i) => acc + (i + 1) * veces,
          0,
        );
        promedio = (suma / totalVictorias).toFixed(1);
      }
      lineas.push(`🔥 ${stats.racha} | Prom. de intentos: ${promedio}`);
    }

    // Línea 4: emojis
    lineas.push(emojis);

    // Línea 5: enlace (al resultado si hay sesión, al juego si no)
    if (sesion) {
      lineas.push(
        `${window.location.origin}/share/${sesion.user.username}/${fecha}`,
      );
    } else {
      lineas.push(window.location.origin);
    }

    // Línea 6: hashtag
    lineas.push("#guessthegeo");

    return lineas.join("\n");
  }

  function copiar() {
    navigator.clipboard.writeText(textoCompartir());
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000); //
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
        {copiado ? "¡Copiado! ✓" : "Compartir resultado"}
      </button>
    </div>
  );
}
