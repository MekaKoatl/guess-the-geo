export default function LayoutJuego({
  imagen,
  hexagonos,
  buscador,
  intentos,
  pistas,
  estadisticas,
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
        {resultado && <div className="space-y-4">{resultado}</div>}
        {estadisticas}
        {pistas}
        {intentos}
        {countdown}
      </div>

      {/* ===== ESCRITORIO: tres columnas ===== */}
      <div className="hidden lg:flex lg:justify-center gap-6 max-w-6xl mx-auto">
        {/* Pistas + estadísticas */}
        <div className="w-80 shrink-0 space-y-4">
          {pistas}
          {estadisticas}
        </div>

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