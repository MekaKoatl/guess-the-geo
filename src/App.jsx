import { useState } from 'react'
import Header from './components/Header'
import HintPanel from './components/HintPanel'
import RockViewer from './components/RockViewer'
import StepTracker from './components/StepTracker'
import GuessForm from './components/GuessForm'
import GuessHistory from './components/GuessHistory'
import { MINERALS, NOMBRES } from './data/minerals'

const MAX_INTENTOS = 6

const norm = (s) =>
  s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

// Campos que comparamos y cómo se muestran en la tarjeta
const CAMPOS = [
  { key: 'familia', label: 'Misma familia' },
  { key: 'color', label: 'Mismo color' },
  { key: 'sistema', label: 'Mismo sistema cristalino' },
]

// Devuelve la lista de coincidencias entre el intento y el objetivo
function coincidencias(elegido, objetivo) {
  return CAMPOS
    .filter((c) => norm(elegido[c.key] || '') === norm(objetivo[c.key] || ''))
    .map((c) => c.label)
}

export default function App() {
  const mineral = MINERALS[0]
  const [guesses, setGuesses] = useState([])
  const [estado, setEstado] = useState('jugando') // jugando | ganado | perdido

  const fallos = guesses.length

  function manejarIntento(respuesta) {
    if (estado !== 'jugando') return // ya terminó, no hacer nada

    const acierto = norm(respuesta) === norm(mineral.nombre)

    // Buscar el mineral elegido en la base de datos (para comparar campos)
    const elegido = MINERALS.find((m) => norm(m.nombre) === norm(respuesta))

    let estadoIntento = 'wrong'
    let similares = []

    if (acierto) {
      estadoIntento = 'correct'
    } else if (elegido) {
      similares = coincidencias(elegido, mineral)
      if (similares.length > 0) estadoIntento = 'partial'
    }

    const nuevo = { nombre: respuesta, estado: estadoIntento, similares }
    const lista = [...guesses, nuevo]
    setGuesses(lista)

    // Decidir si el juego termina
    if (acierto) {
      setEstado('ganado')
    } else if (lista.length >= MAX_INTENTOS) {
      setEstado('perdido')
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <HintPanel pistas={mineral.pistas} reveladas={fallos} />

      <main className="max-w-xl mx-auto pt-6 px-4">
        <Header />
        <RockViewer imagen={mineral.imagen} fallos={fallos} maxIntentos={MAX_INTENTOS} />
        <StepTracker guesses={guesses} maxIntentos={MAX_INTENTOS} />

        {estado === 'jugando' && (
          <GuessForm onGuess={manejarIntento} opciones={NOMBRES} />
        )}

        {estado === 'ganado' && (
          <p className="mt-4 text-center text-green-700 font-medium">
            ¡Correcto! Era {mineral.nombre}.
          </p>
        )}
        {estado === 'perdido' && (
          <p className="mt-4 text-center text-red-700 font-medium">
            Se acabaron los intentos. Era {mineral.nombre}.
          </p>
        )}

        <GuessHistory guesses={guesses} />
      </main>
    </div>
  )
}