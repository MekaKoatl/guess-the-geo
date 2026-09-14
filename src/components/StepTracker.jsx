import hexSinUsar from "../assets/hexagonos/hex-sin-usar.png";
import hexCorrecto from "../assets/hexagonos/hex-correcto.png";
import hexParcial from "../assets/hexagonos/hex-parcial.png";
import hexFallo from "../assets/hexagonos/hex-fallo.png";

const IMAGENES = {
  correct: hexCorrecto,
  partial: hexParcial,
  wrong: hexFallo,
  vacio: hexSinUsar,
};

export default function StepTracker({ guesses = [], maxIntentos = 6 }) {
  return (
    <div className="flex justify-center gap-3 mt-4">
      {Array.from({ length: maxIntentos }).map((_, i) => {
        const intento = guesses[i];
        const esActual = !intento && i === guesses.length; // siguiente a jugar
        const imagen = intento ? IMAGENES[intento.estado] : IMAGENES.vacio;

        return (
          <div
            key={i}
            className={`relative aspect-square transition-transform ${esActual ? "w-14 scale-110" : "w-12"}`}
          >
            {/* Hexágono */}
            <img
              src={imagen}
              alt={`Intento ${i + 1}`}
              className="w-full h-full object-contain"
            />
            {/* Número encima */}
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[var(--color-texto-oscuro)]">
              {i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}