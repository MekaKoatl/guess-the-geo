import { useState } from "react";

const norm = (s) =>
  s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function GuessForm({ onGuess, opciones = [], usados = [] }) {
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState(false);

  const disponibles = opciones.filter(
    (n) => !usados.some((u) => norm(u) === norm(n)),
  );

  const sugerencias = texto.trim()
    ? disponibles.filter((n) => norm(n).includes(norm(texto))).slice(0, 50)
    : [];

  function enviar(valor) {
    let respuesta = valor;
    if (!respuesta) {
      const t = norm(texto);
      const exacta = disponibles.find((n) => norm(n) === t);
      respuesta = exacta || sugerencias[0];
    }
    if (!respuesta) {
      setAviso(true);
      return;
    }
    onGuess(respuesta);
    setTexto("");
    setAviso(false);
  }

  return (
    <div className="relative">
      <div className="flex rounded-md overflow-hidden border-2 bg-[#b8a999]">
        <input
          type="text"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAviso(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escribe y elige de la lista…"
          className="flex-1 px-3 py-2 bg-transparent text-[var(--color-texto-oscuro)] placeholder:text-[#5a4d3d] outline-none"
        />
        <button
          onClick={() => enviar()}
          className="px-4 bg-[#2a2418] hover:bg-[#3a3428] text-[var(--color-texto)]"
        >
          Submit
        </button>
      </div>

      {aviso && (
        <p className="text-xs text-red-300 mt-1">
          Elige un mineral o roca real.
        </p>
      )}

      {sugerencias.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 rounded-md overflow-hidden border-2 bg-[#1a1512] shadow-lg max-h-36 overflow-y-auto">
          <li className="px-3 py-1 text-xs text-[var(--color-texto-suave)] border-b border-white/10 sticky top-0 bg-[#1a1512]">
            {sugerencias.length} resultados
          </li>
          {sugerencias.map((s) => (
            <li key={s}>
              <button
                onClick={() => enviar(s)}
                className="w-full text-left px-3 py-1 text-sm text-[var(--color-texto)] hover:bg-white/10"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}