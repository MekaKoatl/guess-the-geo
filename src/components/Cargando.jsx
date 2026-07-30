export default function Cargando({ mensaje = "Cargando…" }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <div
        className="w-12 h-12 rounded-full border-4 border-white/15
                   border-t-[var(--color-borde-punteado)] animate-spin"
      />
      <p className="text-[var(--color-texto-suave)] text-sm">{mensaje}</p>
    </div>
  );
}