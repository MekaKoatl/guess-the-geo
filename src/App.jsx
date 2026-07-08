import Header from './components/Header'
import HintPanel from './components/HintPanel'
import RockViewer from './components/RockViewer'
import { MINERALS } from './data/minerals'

export default function App() {
  const mineral = MINERALS[0]

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <HintPanel pistas={mineral.pistas} reveladas={2} />

      <main className="max-w-xl mx-auto pt-6 px-4">
        <Header />
        {/* Cambia fallos={0} por 3, 6… y verás cómo se aclara */}
        <RockViewer imagen={mineral.imagen} fallos={0} />
      </main>
    </div>
  )
}