export default function Cargando({ mensaje = "Cargando…" }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <style>{`
        @keyframes picar {
          0%, 100% { transform: rotate(-45deg); }
          45% { transform: rotate(-45deg); }
          55% { transform: rotate(5deg); }
          65% { transform: rotate(5deg); }
        }
        @keyframes fragmento-1 {
          0%, 55% { transform: translate(0, 0); opacity: 0; }
          60% { opacity: 1; }
          100% { transform: translate(22px, -18px); opacity: 0; }
        }
        @keyframes fragmento-2 {
          0%, 55% { transform: translate(0, 0); opacity: 0; }
          60% { opacity: 1; }
          100% { transform: translate(30px, 4px); opacity: 0; }
        }
        @keyframes fragmento-3 {
          0%, 55% { transform: translate(0, 0); opacity: 0; }
          60% { opacity: 1; }
          100% { transform: translate(16px, 14px); opacity: 0; }
        }
        @keyframes temblor {
          0%, 54%, 100% { transform: translate(0, 0); }
          58% { transform: translate(-2px, 1px); }
          62% { transform: translate(1px, 0); }
        }
        .pico-anim {
          transform-origin: 70% 70%;
          animation: picar 1.1s ease-in-out infinite;
        }
        .roca-anim { animation: temblor 1.1s ease-in-out infinite; }
        .frag-1 { animation: fragmento-1 1.1s ease-out infinite; }
        .frag-2 { animation: fragmento-2 1.1s ease-out infinite; }
        .frag-3 { animation: fragmento-3 1.1s ease-out infinite; }
      `}</style>

      <svg viewBox="0 0 200 200" className="w-40 h-40">
        {/* --- ROCA (abajo izquierda) --- */}
        <g className="roca-anim">
          <path
            d="M 30 175 L 30 120 L 55 110 L 78 125 L 72 150 L 85 175 Z"
            fill="#c07050"
            stroke="#1e2a5a"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </g>

        {/* --- FRAGMENTOS que saltan --- */}
        <g transform="translate(80 120)">
          <path
            className="frag-1"
            d="M 0 0 L 6 -3 L 8 3 L 2 6 Z"
            fill="#c07050"
            stroke="#1e2a5a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            className="frag-2"
            d="M 0 0 L 5 -2 L 7 4 L 1 5 Z"
            fill="#c07050"
            stroke="#1e2a5a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            className="frag-3"
            d="M 0 0 L 5 -3 L 6 2 L 0 4 Z"
            fill="#c07050"
            stroke="#1e2a5a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>

        {/* --- PICO (arriba, gira para golpear) --- */}
        <g className="pico-anim">
          {/* Mango */}
          <rect
            x="95"
            y="95"
            width="70"
            height="16"
            rx="8"
            fill="#7c7ce8"
            stroke="#1e2a5a"
            strokeWidth="6"
            transform="rotate(45 100 100)"
          />
          {/* Cabeza del pico (media luna) */}
          <path
            d="M 80 60 Q 130 55 140 95 Q 110 78 90 92 Q 82 75 80 60 Z"
            fill="#dfe4ff"
            stroke="#1e2a5a"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      <p className="text-[var(--color-texto-suave)] text-sm animate-pulse">
        {mensaje}
      </p>
    </div>
  );
}
