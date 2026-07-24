import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

// Color de fondo para cada resultado del patrón
const COLOR_PATRON = {
  correct: "bg-[var(--color-verde-borde)]",
  partial: "bg-[var(--color-amarillo-borde)]",
  wrong: "bg-[var(--color-rojo-borde)]",
};

export default function SharePage({ username, fecha, onVolver }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/share/${username}/${fecha}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setDatos(d);
      })
      .catch(() => setError("No se pudo cargar el resultado."));
  }, [username, fecha]);

  // --- ERROR ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center rounded-md p-6 bg-[var(--color-superficie)] border-2 border-dashed border-[var(--color-borde-punteado)]">
          <p className="text-[var(--color-rojo-borde)] mb-4">{error}</p>
          <button
            onClick={onVolver}
            className="bg-[var(--color-verde-borde)] hover:brightness-110 text-white rounded px-4 py-2 font-semibold transition"
          >
            Ir al juego
          </button>
        </div>
      </div>
    );
  }

  // --- CARGANDO ---
  if (!datos) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-[var(--color-texto-suave)]">Cargando…</p>
      </div>
    );
  }

  // --- RESULTADO ---
  const marcador =
    datos.estado === "ganado"
      ? `${datos.intentos}/6`
      : datos.estado === "perdido"
        ? "X/6"
        : "En curso";

  const gano = datos.estado === "ganado";

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Título del sitio */}
        <h1 className="text-4xl text-center mb-6">Guess The Geo</h1>

        {/* Tarjeta del resultado */}
        <div className="rounded-md p-6 bg-[var(--color-superficie)] border-2 border-dashed border-[var(--color-borde-punteado)] text-center">
          <p className="text-sm text-[var(--color-texto-suave)] uppercase tracking-widest mb-1">
            Resultado de
          </p>
          <p className="text-2xl font-semibold text-[var(--color-texto)] mb-1">
            {datos.username}
          </p>
          <p className="text-sm text-[var(--color-texto-suave)] mb-5">
            {datos.fecha}
          </p>

          {/* Cuadraditos de intentos */}
          <div className="flex justify-center gap-1.5 mb-4">
            {datos.patron.map((estado, i) => (
              <span
                key={i}
                className={`w-8 h-8 rounded ${COLOR_PATRON[estado] || "bg-white/10"}`}
              />
            ))}
          </div>

          {/* Marcador */}
          <p
            className={`text-lg font-semibold mb-6 ${
              gano
                ? "text-[var(--color-verde-borde)]"
                : datos.estado === "perdido"
                  ? "text-[var(--color-rojo-borde)]"
                  : "text-[var(--color-texto-suave)]"
            }`}
          >
            {marcador}
          </p>

          {/* Ir al juego */}
          <button
            onClick={onVolver}
            className="w-full bg-[var(--color-verde-borde)] hover:brightness-110 text-white rounded py-2.5 font-semibold transition"
          >
            Jugar hoy
          </button>
        </div>
      </div>
    </div>
  );
}