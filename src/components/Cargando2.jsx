import roca from "../assets/roca.svg";
import pico from "../assets/pico.svg";
import gema from "../assets/gema.svg";

export default function Cargando2({ mensaje = "Cargando…" }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <style>{`
  @keyframes picar {
    0%, 34% { transform: rotate(45deg); }
    50%, 57% { transform: rotate(-20deg); }
    78%, 100% { transform: rotate(45deg); }
  }
  @keyframes temblor {
    0%, 49%, 66%, 100% { transform: translate(0, 0); }
    53% { transform: translate(-5px, 3.0px); }
    59% { transform: translate(3.0px, -1.5px); }
  }
  @keyframes saltar {
    0%, 49% { transform: translate(0, 0) scale(0.3); opacity: 0; }
    52% { transform: translate(0, 0) scale(1); opacity: 1; }
    90%, 100% { transform: translate(46px, -90px) scale(0.5); opacity: 0; }
  }
  .anim-pico { transform-origin: 75% 80%;
               animation: picar 1s ease-in-out infinite; }
  .anim-roca { animation: temblor 1s ease-in-out infinite; }
  .anim-gema { animation: saltar 1s ease-out infinite; }
`}</style>

      <div className="relative w-48 h-48">
        <img
          src={roca}
          alt=""
          className="anim-roca absolute left-[-1px] bottom-[7px] w-[103px]"
        />
        <img
          src={gema}
          alt=""
          className="anim-gema absolute left-[68px] bottom-[65px] w-[41px]"
        />
        <img
          src={pico}
          alt=""
          className="anim-pico absolute right-[10px] top-[16px] w-[112px]"
        />
      </div>

      <p className="text-[var(--color-texto-suave)] text-sm">{mensaje}</p>
    </div>
  );
}
