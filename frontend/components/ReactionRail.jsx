import { useEffect, useRef, useState } from "react";
import { socket } from "../src/socket.js";

// Apple-style reactions that rise and fade from the top-right of the TV.
// Runs alongside the full-screen ReactionOverlay burst.
function ReactionRail() {
  const [items, setItems] = useState([]);
  const seq = useRef(0);

  useEffect(() => {
    const onReaction = ({ emoji }) => {
      const id = seq.current++;
      const x = Math.random() * 22 - 11; // small horizontal wander (px)
      setItems((prev) => [...prev, { id, emoji, x }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((it) => it.id !== id));
      }, 2700);
    };
    socket.on("reaction", onReaction);
    return () => socket.off("reaction", onReaction);
  }, []);

  return (
    <div className="reaction-rail" aria-hidden="true">
      {items.map((it) => (
        <span key={it.id} className="rail-emoji" style={{ "--x": `${it.x}px` }}>
          {it.emoji}
        </span>
      ))}
    </div>
  );
}

export default ReactionRail;
