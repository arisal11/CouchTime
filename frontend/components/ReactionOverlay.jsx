import { useEffect, useRef, useState } from "react";
import { socket } from "../src/socket.js";

// Listens for `reaction` events and rains a burst of the emoji across the
// whole screen. Purely visual — sits above everything, ignores pointer events.
function ReactionOverlay() {
  const [particles, setParticles] = useState([]);
  const seq = useRef(0);

  useEffect(() => {
    const onReaction = ({ emoji }) => {
      const burst = Array.from({ length: 14 }).map(() => {
        const id = seq.current++;
        return {
          id,
          emoji,
          left: Math.random() * 92 + 2, // vw
          bottom: Math.random() * 30, // start scattered near lower half
          drift: (Math.random() - 0.5) * 160, // px sideways travel
          size: 26 + Math.random() * 40, // px
          duration: 2.2 + Math.random() * 1.6, // s
          delay: Math.random() * 0.35, // s
          rotate: (Math.random() - 0.5) * 60, // deg
        };
      });
      setParticles((prev) => [...prev, ...burst]);

      const maxLife = 4200;
      const ids = new Set(burst.map((b) => b.id));
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
      }, maxLife);
    };

    socket.on("reaction", onReaction);
    return () => socket.off("reaction", onReaction);
  }, []);

  return (
    <div className="reaction-overlay" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="reaction-particle"
          style={{
            left: `${p.left}vw`,
            bottom: `${p.bottom}vh`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
            "--rot": `${p.rotate}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

export default ReactionOverlay;
