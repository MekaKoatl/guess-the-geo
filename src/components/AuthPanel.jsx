import { useState } from "react";
import { iniciarSesion, registrar } from "../api/backend";

export default function AuthPanel({ onSesion, onCerrar }) {
  const [modo, setModo] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar() {
    setError("");
    setCargando(true);
    try {
      let sesion;
      if (modo === "registro") {
        await registrar(username, email, password);
        sesion = await iniciarSesion(email, password);
      } else {
        sesion = await iniciarSesion(email, password);
      }
      onSesion(sesion.token, sesion.user);
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
          {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        <div className="space-y-2">
          {modo === "registro" && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[var(--color-superficie)] border border-[var(--color-borde-punteado)]/50 text-[var(--color-texto)] placeholder:text-[var(--color-texto-suave)] outline-none focus:border-[var(--color-borde-punteado)]"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[var(--color-superficie)] border border-[var(--color-borde-punteado)]/50 text-[var(--color-texto)] placeholder:text-[var(--color-texto-suave)] outline-none focus:border-[var(--color-borde-punteado)]"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[var(--color-superficie)] border border-[var(--color-borde-punteado)]/50 text-[var(--color-texto)] placeholder:text-[var(--color-texto-suave)] outline-none focus:border-[var(--color-borde-punteado)]"
          />
        </div>

        {error && (
          <p className="text-sm text-red-300 mt-2">{error}</p>
        )}

        <button
          onClick={enviar}
          disabled={cargando}
          className="w-full bg-[var(--color-verde-borde)] hover:brightness-110 text-white rounded py-2 mt-4 font-semibold transition disabled:opacity-50"
        >
          {cargando ? "..." : modo === "login" ? "Entrar" : "Registrarse"}
        </button>

        <p className="text-sm text-center mt-3 text-[var(--color-texto-suave)]">
          {modo === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={() => {
              setModo(modo === "login" ? "registro" : "login");
              setError("");
            }}
            className="underline hover:text-[var(--color-borde-punteado)]"
          >
            {modo === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}