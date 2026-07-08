import { useState } from 'react'

export default function GuessForm({ onGuess }) {
  const [texto, setTexto] = useState('')

  function enviar() {
    if (!texto.trim()) return   // no enviar vacío
    onGuess(texto)              // avisa a App con la respuesta
    setTexto('')               // limpia el input
  }

  return (
    <div className="flex border border-neutral-400 rounded overflow-hidden mt-4">
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && enviar()}
        className="flex-1 px-3 py-2 outline-none"
      />
      <button
        onClick={enviar}
        className="px-4 bg-neutral-200 hover:bg-neutral-300"
      >
        Submit
      </button>
    </div>
  )
}