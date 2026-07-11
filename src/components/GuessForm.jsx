import { useState } from 'react'

const norm = (s) =>
  s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function GuessForm({ onGuess, opciones = [], usados = [] }) {
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState(false)

  
  const disponibles = opciones.filter(
    (n) => !usados.some((u) => norm(u) === norm(n))
  )

 
  const sugerencias = texto.trim()
    ? disponibles.filter((n) => norm(n).includes(norm(texto))).slice(0, 25)
    : []

  function enviar(valor) {
    
    let respuesta = valor

    if (!respuesta) {
      const t = norm(texto)
      // ¿Coincide?
      const exacta = disponibles.find((n) => norm(n) === t)
      // 
      respuesta = exacta || sugerencias[0]
    }

    // 
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
        <ul className="absolute z-10 w-full bg-white border border-neutral-300 rounded mt-1 shadow max-h-36 overflow-y-auto">
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