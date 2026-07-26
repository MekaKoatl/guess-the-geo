import { useState } from "react";
import { eliminarCuenta } from "../api/backend";

export default function MenuCuenta({ sesion, onCerrarSesion, onCuentaEliminada }) {
  const [abierto, setAbierto] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function borrar() {
    setError("");
    setCargando(true);
    try {
      await eliminarCuenta(sesion.token, password);
      onCuentaEliminada(); // avisa a App para limpiar sesión
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="relative inline-block">
      {/* Nombre clicable */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="hover:text-[var(--color-borde-punteado)]"
      >
        Hola, {sesion.user.username} ▾
      </button>

      {/* Menú desplegable */}
      {abierto && (
        <div className="absolute left-0 mt-2 w-44 rounded-md bg-[var(--color-fondo-alto)] border border-[var(--color-borde-punteado)]/40 shadow-lg z-30 py-1 text-left">
          <button
            onClick={() => {
              setAbierto(false);
              onCerrarSesion();
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-white/10"
          >
            Cerrar sesión
          </button>
          <button
            onClick={() => {
              setAbierto(false);
              setConfirmando(true);
            }}
            className="w-full text-left px-3 py-2 text-sm text-[var(--color-rojo-borde)] hover:bg-white/10"
          >
            Eliminar cuenta
          </button>
        </div>
      )}

      {/* Modal de confirmación con contraseña */}
      {confirmando && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-80 rounded-lg p-6 bg-[var(--color-fondo-alto)] border-2 border-dashed border-[var(--color-rojo-borde)] shadow-2xl text-center">
            <h2 className="text-lg font-semibold mb-2 text-[var(--color-texto)]">
              Eliminar cuenta
            </h2>
            <p className="text-sm text-[var(--color-texto-suave)] mb-4">
              Esto borrará tu cuenta y todo tu progreso de forma permanente. No
              se puede deshacer.
            </p>

            <input
              type="password"
              placeholder="Confirma tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mb-2 rounded bg-[var(--color-superficie)] border border-[var(--color-borde-punteado)]/50 text-[var(--color-texto)] placeholder:text-[var(--color-texto-suave)] outline-none focus:border-[var(--color-borde-punteado)]"
            />

            {error && <p className="text-sm text-red-300 mb-2">{error}</p>}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setConfirmando(false);
                  setPassword("");
                  setError("");
                }}
                className="flex-1 py-2 rounded bg-white/10 hover:bg-white/20 text-[var(--color-texto)] font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={borrar}
                disabled={cargando}
                className="flex-1 py-2 rounded bg-[var(--color-rojo-borde)] hover:brightness-110 text-white font-semibold disabled:opacity-50"
              >
                {cargando ? "..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}