import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

// Emoji por estado
const EMOJI = { correct: "🟩", partial: "🟨", wrong: "🟥" };

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

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button onClick={onVolver} className="underline">
          Ir al juego
        </button>
      </div>
    );
  }

  if (!datos) return <p className="p-6 text-center">Cargando…</p>;

  const emojis = datos.patron.map((e) => EMOJI[e] || "⬜").join("");
  const marcador =
    datos.estado === "ganado"
      ? `${datos.intentos}/6`
      : datos.estado === "perdido"
        ? "X/6"
        : "En curso";

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-medium mb-2">
          Resultado de {datos.username}
        </h1>
        <p className="text-sm text-neutral-600 mb-6">{datos.fecha}</p>

        <div className="text-3xl mb-2">{emojis}</div>
        <p className="text-lg font-medium mb-6">Guess The Geo {marcador}</p>

        <button
          onClick={onVolver}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
        >
          Jugar hoy
        </button>
      </div>
    </div>
  );
}