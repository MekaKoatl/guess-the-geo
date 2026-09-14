import { useState } from "react";
import { restablecerPassword } from "../api/backend";

export default function RestablecerPage({ token, onVolver }) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);

  async function enviar() {
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setCargando(true);
    try {
      await restablecerPassword(token, password);
      setListo(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl text-center mb-6">Guess The Geo</h1>

        <div className="rounded-md p-6 bg-[var(--color-superficie)] border-2 border-dashed border-[var(--color-borde-punteado)]">
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-texto)] border-b border-white/40 pb-2">
            Nueva contraseña
          </h2>

          {listo ? (
            <>
              <p className="text-sm text-[var(--color-texto)] mb-4">
                Tu contraseña se actualizó correctamente. Ya puedes iniciar
                sesión con ella.
              </p>
              <button
                onClick={onVolver}
                className="w-full bg-[var(--color-verde-borde)] hover:brightness-110 text-white rounded py-2 font-semibold transition"
              >
                Ir al juego
              </button>
            </>
          ) : (
            <>
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mb-2 rounded bg-[var(--color-superficie)] border border-[var(--color-borde-punteado)]/50 text-[var(--color-texto)] placeholder:text-[var(--color-texto-suave)] outline-none focus:border-[var(--color-borde-punteado)]"
              />
              <input
                type="password"
                placeholder="Repite la contraseña"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[var(--color-superficie)] border border-[var(--color-borde-punteado)]/50 text-[var(--color-texto)] placeholder:text-[var(--color-texto-suave)] outline-none focus:border-[var(--color-borde-punteado)]"
              />

              {error && <p className="text-sm text-red-300 mt-2">{error}</p>}

              <button
                onClick={enviar}
                disabled={cargando}
                className="w-full bg-[var(--color-verde-borde)] hover:brightness-110 text-white rounded py-2 mt-4 font-semibold transition disabled:opacity-50"
              >
                {cargando ? "..." : "Guardar contraseña"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}