import { useState } from "react";
import { olvidePassword } from "../api/backend";

export default function OlvidePasswordPanel({ onCerrar, onVolverLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviar() {
    setError("");
    setCargando(true);
    try {
      await olvidePassword(email);
      setEnviado(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-80 rounded-lg p-6 bg-[var(--color-fondo-alto)] border-2 shadow-2xl">
        <button
          onClick={onCerrar}
          className="absolute top-2 right-3 text-[var(--color-texto-suave)] hover:text-[var(--color-texto)] text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-[var(--color-texto)] border-b border-white/40 pb-2">
          Recuperar contraseña
        </h2>

        {enviado ? (
          <>
            <p className="text-sm text-[var(--color-texto)] mb-4">
              Si el correo existe, te enviamos un enlace para restablecer tu
              contraseña. Revisa tu bandeja de entrada (y spam).
            </p>
            <button
              onClick={onVolverLogin}
              className="w-full bg-[var(--color-verde-borde)] hover:brightness-110 text-white rounded py-2 font-semibold transition"
            >
              Volver
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-[var(--color-texto-suave)] mb-3">
              Escribe tu email y te enviaremos un enlace para elegir una nueva
              contraseña.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[var(--color-superficie)] border border-[var(--color-borde-punteado)]/50 text-[var(--color-texto)] placeholder:text-[var(--color-texto-suave)] outline-none focus:border-[var(--color-borde-punteado)]"
            />

            {error && <p className="text-sm text-red-300 mt-2">{error}</p>}

            <button
              onClick={enviar}
              disabled={cargando}
              className="w-full bg-[var(--color-verde-borde)] hover:brightness-110 text-white rounded py-2 mt-4 font-semibold transition disabled:opacity-50"
            >
              {cargando ? "..." : "Enviar enlace"}
            </button>

            <button
              onClick={onVolverLogin}
              className="w-full text-center text-sm mt-2 underline text-[var(--color-texto-suave)] hover:text-[var(--color-borde-punteado)]"
            >
              Volver a iniciar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}