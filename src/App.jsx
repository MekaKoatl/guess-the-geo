import { useState } from 'react'
import Header from './components/Header'
import HintPanel from './components/HintPanel'
import RockViewer from './components/RockViewer'
import StepTracker from './components/StepTracker'
import GuessForm from './components/GuessForm'
import { MINERALS } from './data/minerals'

const MAX_INTENTOS = 6

export default function App() {
  const mineral = MINERALS[0]              // objetivo (fijo por ahora)
  const [guesses, setGuesses] = useState([]) // lista de respuestas enviadas

  // Valores calculados a partir de los intentos:
  const fallos = guesses.length
  const revelar = fallos // 1 pista por fallo

  function manejarIntento(respuesta) {
    setGuesses([...guesses, respuesta])   // añade el intento a la lista
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <HintPanel pistas={mineral.pistas} reveladas={revelar} />

      <main className="max-w-xl mx-auto pt-6 px-4">
        <Header />
        <RockViewer imagen={mineral.imagen} fallos={fallos} maxIntentos={MAX_INTENTOS} />
        <StepTracker intentoActual={fallos} maxIntentos={MAX_INTENTOS} />
        <GuessForm onGuess={manejarIntento} />
      </main>
    </div>
  )
}