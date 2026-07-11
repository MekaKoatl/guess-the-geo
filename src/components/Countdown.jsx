import { useState, useEffect } from "react";

// Milisegundos hasta la próxima medianoche UTC
function faltaHastaManana() {
  const ahora = new Date();
  const manana = Date.UTC(
    ahora.getUTCFullYear(),
    ahora.getUTCMonth(),
    ahora.getUTCDate() + 1, // el día siguient
  );
  return manana - ahora.getTime();
}


function formatear(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}h ${m}m ${s}s`;
}

export default function Countdown() {
  const [restante, setRestante] = useState(faltaHastaManana());

  // Actualiza cada segundo
  useEffect(() => {
    const id = setInterval(() => setRestante(faltaHastaManana()), 1000);
    return () => clearInterval(id); // limpia al desmontar
  }, []);

  return (
    <div className="mt-4 text-center text-sm text-neutral-600">
      <p>Nuevo mineral o roca en:</p>
      <p className="font-medium text-neutral-900">{formatear(restante)}</p>
    </div>
  );
}