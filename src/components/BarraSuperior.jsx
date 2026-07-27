import MenuCuenta from "./MenuCuenta";

export default function BarraSuperior({
  sesion,
  onCerrarSesion,
  onCuentaEliminada,
  onAbrirAuth,
  onVerListado,
}) {
  return (
    <header className="text-center mb-4">
      <h1 className="text-4xl sm:text-5xl mb-3">Guess The Geo</h1>
      <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm">
        {sesion ? (
          <MenuCuenta
            sesion={sesion}
            onCerrarSesion={onCerrarSesion}
            onCuentaEliminada={onCuentaEliminada}
          />
        ) : (
          <button
            onClick={onAbrirAuth}
            className="underline hover:text-[var(--color-borde-punteado)]"
          >
            Iniciar sesión
          </button>
        )}
        <span className="text-[var(--color-texto-suave)]">|</span>
        <button
          onClick={onVerListado}
          className="underline hover:text-[var(--color-borde-punteado)]"
        >
          Días anteriores
        </button>
      </nav>
    </header>
  );
}