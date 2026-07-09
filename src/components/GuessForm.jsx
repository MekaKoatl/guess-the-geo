import { useState } from 'react'

const norm = (s) =>
  s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function GuessForm({ onGuess, opciones = [] }) {
  const [texto, setTexto] = useState('')

  // Sugerencias
  const sugerencias = texto.trim()
    ? opciones.filter((n) => norm(n).includes(norm(texto))).slice(0, 6)
    : []

  function enviar(valor) {
    const respuesta = valor ?? texto
    if (!respuesta.trim()) return
    onGuess(respuesta)
    setTexto('')
  }

  return (
    <div className="relative mt-4">
      <div className="flex border border-neutral-400 rounded overflow-hidden">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          className="flex-1 px-3 py-2 outline-none"
        />
        <button
          onClick={() => enviar()}
          className="px-4 bg-neutral-200 hover:bg-neutral-300"
        >
          Submit
        </button>
      </div>

      {sugerencias.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-neutral-300 rounded mt-1 shadow">
          {sugerencias.map((s) => (
            <li key={s}>
              <button
                onClick={() => enviar(s)}
                className="w-full text-left px-3 py-2 hover:bg-neutral-100"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}