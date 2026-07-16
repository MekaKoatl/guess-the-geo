import { useState } from "react";
import { iniciarSesion, registrar } from "../api/backend";

export default function AuthPanel({ onSesion, onCerrar }) {
  const [modo, setModo] = useState("login"); // login | registro
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
        // Registrar y luego iniciar sesión automáticamente
        await registrar(username, email, password);
        sesion = await iniciarSesion(email, password);
      } else {
        sesion = await iniciarSesion(email, password);
      }
      onSesion(sesion.token, sesion.user); // avisar a App
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 relative">
        <button
          onClick={onCerrar}
          className="absolute top-2 right-3 text-neutral-400 hover:text-neutral-700"
        >
          ✕
        </button>

        <h2 className="text-lg font-medium mb-4">
          {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        <div className="space-y-2">
          {modo === "registro" && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-neutral-300 rounded px-3 py-2"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-300 rounded px-3 py-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neutral-300 rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <button
          onClick={enviar}
          disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 mt-4 disabled:opacity-50"
        >
          {cargando ? "..." : modo === "login" ? "Entrar" : "Registrarse"}
        </button>

        <p className="text-sm text-center mt-3 text-neutral-600">
          {modo === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={() => {
              setModo(modo === "login" ? "registro" : "login");
              setError("");
            }}
            className="text-blue-600 underline"
          >
            {modo === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}