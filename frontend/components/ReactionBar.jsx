import { socket } from "../src/socket.js";
import { REACTIONS } from "../src/reactions.js";

// Row of tappable emoji that broadcast a reaction to the whole room.
function ReactionBar({ code }) {
  const send = (emoji) => socket.emit("reaction:send", { code, emoji });

  return (
    <div className="reaction-bar">
      {REACTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className="reaction-btn"
          onClick={() => send(emoji)}
          aria-label={`React ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

export default ReactionBar;
