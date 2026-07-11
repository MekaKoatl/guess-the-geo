import { useState } from 'react'

const norm = (s) =>
  s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function GuessForm({ onGuess, opciones = [] }) {
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState(false)

  // Sugerencias que coinciden con lo escrito
  const sugerencias = texto.trim()
    ? opciones.filter((n) => norm(n).includes(norm(texto))).slice(0, 6)
    : []

  function enviar(valor) {
    // Si viene un valor (clic en sugerencia), ese manda.
    // Si no, intentamos validar el texto escrito.
    let respuesta = valor

    if (!respuesta) {
      const t = norm(texto)
      // ¿Coincide exactamente con una opción?
      const exacta = opciones.find((n) => norm(n) === t)
      // Si no, tomamos la primera sugerencia disponible
      respuesta = exacta || sugerencias[0]
    }

    // Si no hay respuesta válida, avisamos y no enviamos
    if (!respuesta) {
      setAviso(true)
      return
    }

    onGuess(respuesta)
    setTexto('')
    setAviso(false)
  }

  return (
    <div className="relative mt-4">
      <div className="flex border border-neutral-400 rounded overflow-hidden">
        <input
          type="text"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            setAviso(false)
          }}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          placeholder="Escribe y elige de la lista…"
          className="flex-1 px-3 py-2 outline-none"
        />
        <button
          onClick={() => enviar()}
          className="px-4 bg-neutral-200 hover:bg-neutral-300"
        >
          Submit
        </button>
      </div>

      {aviso && (
        <p className="text-xs text-red-600 mt-1">
          Elige un mineral o roca real.
        </p>
      )}

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