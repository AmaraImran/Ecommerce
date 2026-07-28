import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // trigger the settle-in animation shortly after mount
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="w-full bg-[#EDE4D3] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between py-20 md:py-28 gap-12">

        {/* LEFT TEXT */}
        <div className="md:w-1/2 space-y-6 relative z-10">
          <p className="text-[#3F5B4E] font-medium tracking-widest text-sm uppercase">
            Ludanza Home
          </p>

          <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-[#2B2420] leading-[1.15]">
            Make every corner
            <br />
            feel like home.
          </h1>

          <p className="text-[#5C5346] text-lg max-w-md">
            Hand-picked decor, plants, and stationery for slower mornings
            and softer evenings.
          </p>

          <Link
            to="/product"
            className="inline-flex items-center px-7 py-3.5 bg-[#3F5B4E] text-[#FBF7EE] rounded-lg hover:bg-[#2F4A3D] transition-colors duration-300 font-medium"
          >
            Shop the collection
          </Link>
        </div>

        {/* RIGHT — PINNED PHOTO STACK */}
        <div className="md:w-1/2 relative flex justify-center items-center h-[420px] w-full">
          <Polaroid
            src="/cozy-cottage-night.jpg"
            alt="Cottage garden at night"
            className="w-[220px] md:w-[240px] left-[8%] top-[8%]"
            restRotate={-8}
            startRotate={-22}
            delay={0}
            loaded={loaded}
          />
          <Polaroid
            src="/cozy-tea-book.jpg"
            alt="Tea and journal on the counter"
            className="w-[190px] md:w-[210px] left-[42%] top-[38%]"
            restRotate={6}
            startRotate={20}
            delay={120}
            loaded={loaded}
          />
          <Polaroid
            src="/cozy-reading-nook.jpg"
            alt="Cozy reading nook by the fire"
            className="w-[230px] md:w-[260px] left-[18%] top-[52%]"
            restRotate={-3}
            startRotate={-14}
            delay={240}
            loaded={loaded}
          />
        </div>
      </div>

      {/* ambient drifting motes — pure CSS, cheap, subtle */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="mote"
            style={{
              left: `${8 + i * 12}%`,
              animationDelay: `${i * 1.3}s`,
              animationDuration: `${9 + (i % 3) * 2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        .mote {
          position: absolute;
          bottom: -10px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: radial-gradient(circle, #D9A44188, transparent 70%);
          animation-name: float-up;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          opacity: 0;
        }

        @keyframes float-up {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(-160px) translateX(10px); opacity: 0.4; }
          90% { opacity: 0; }
          100% { transform: translateY(-320px) translateX(-6px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mote { animation: none; display: none; }
        }
      `}</style>
    </section>
  );
}

function Polaroid({ src, alt, className, restRotate, startRotate, delay, loaded }) {
  return (
    <div
      className={`absolute bg-white p-3 pb-4 rounded-sm shadow-xl transition-all ease-out hover:-translate-y-2 hover:shadow-2xl ${className}`}
      style={{
        transform: `rotate(${loaded ? restRotate : startRotate}deg)`,
        opacity: loaded ? 1 : 0,
        transitionDuration: "700ms",
        transitionDelay: `${delay}ms`,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-40 md:h-44 object-cover rounded-sm"
        loading="eager"
      />
    </div>
  );
}