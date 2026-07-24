import { useState, useEffect } from "react";

function faltaHastaManana() {
  const ahora = new Date();
  const manana = Date.UTC(
    ahora.getUTCFullYear(),
    ahora.getUTCMonth(),
    ahora.getUTCDate() + 1,
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

  useEffect(() => {
    const id = setInterval(() => setRestante(faltaHastaManana()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-[var(--color-texto-suave)] uppercase tracking-widest">
        Nuevo mineral o roca en
      </p>
      <p className="text-2xl font-semibold text-[var(--color-texto)] mt-1 font-mono">
        {formatear(restante)}
      </p>
    </div>
  );
}