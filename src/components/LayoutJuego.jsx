export default function LayoutJuego({
  imagen,
  hexagonos,
  buscador,
  intentos,
  pistas,
  resultado,
  countdown,
}) {
  return (
    <>
      {/* ===== MÓVIL: una columna ===== */}
      <div className="flex flex-col gap-4 lg:hidden">
        {imagen}
        {hexagonos}
        {buscador}
        {intentos}
        {pistas}
        {resultado && <div className="space-y-4">{resultado}</div>}
        {countdown}
      </div>

      {/* ===== ESCRITORIO: tres columnas ===== */}
      <div className="hidden lg:flex lg:justify-center gap-6 max-w-6xl mx-auto">
        {/* Pistas */}
        <div className="w-80 shrink-0">{pistas}</div>

        {/* Juego */}
        <main className="max-w-md w-full">
          {imagen}
          {hexagonos}
          {resultado && <div className="space-y-4">{resultado}</div>}
          {countdown}
        </main>

        {/* Buscador + intentos */}
        <div className="w-80 shrink-0 self-start space-y-4">
          {buscador}
          {intentos}
        </div>
      </div>
    </>
  );
}