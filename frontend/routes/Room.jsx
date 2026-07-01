import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../src/socket.js";
import ReactionOverlay from "../components/ReactionOverlay.jsx";
import ReactionBar from "../components/ReactionBar.jsx";

function Room() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState(
    () => localStorage.getItem("couchtime:name") || ""
  );
  const [state, setState] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const nameRef = useRef(name);
  nameRef.current = name;

  // Re-join automatically on (re)connect once we have a name.
  useEffect(() => {
    const join = () => {
      if (!nameRef.current.trim()) return;
      socket.emit(
        "room:join",
        { code, name: nameRef.current.trim() },
        (res) => {
          if (res?.ok) {
            setJoined(true);
            setState(res.state);
            setError("");
          } else {
            setError(res?.error || "Couldn't join room");
          }
        }
      );
    };

    if (joined) join(); // rejoin path after reconnect handled below
    socket.on("connect", join);

    const onState = (s) => {
      if (s.code === code) setState(s);
    };
    socket.on("room:state", onState);

    return () => {
      socket.off("connect", join);
      socket.off("room:state", onState);
    };
  }, [code, joined]);

  const handleJoin = (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    localStorage.setItem("couchtime:name", clean);
    socket.emit("room:join", { code, name: clean }, (res) => {
      if (res?.ok) {
        setJoined(true);
        setState(res.state);
        setError("");
      } else {
        setError(res?.error || "Couldn't join room");
      }
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const clean = url.trim();
    if (!clean) return;
    setError("");
    socket.emit("video:add", { code, url: clean }, (res) => {
      if (res?.ok) {
        setUrl("");
        setFlash("Added to the queue!");
        setTimeout(() => setFlash(""), 1800);
      } else {
        setError(res?.error || "Couldn't add that video");
      }
    });
  };

  const control = (action) => socket.emit("player:control", { code, action });
  const removeItem = (id) => socket.emit("video:remove", { code, id });
  const bumpItem = (id) => socket.emit("video:next-up", { code, id });

  if (!joined) {
    return (
      <div className="remote join-gate">
        <h2>Join room <span className="room-code inline">{code}</span></h2>
        <form onSubmit={handleJoin} className="stack">
          <label className="field-label">Your name</label>
          <input
            className="input"
            placeholder="e.g. Sam"
            value={name}
            maxLength={24}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-primary full">Join</button>
        </form>
        {error && <p className="error-text">{error}</p>}
        <button className="link-btn" onClick={() => navigate("/")}>← Home</button>
      </div>
    );
  }

  const current = state?.current;
  const queue = state?.queue || [];

  return (
    <div className="remote">
      <ReactionOverlay />
      <div className="remote-head">
        <span className="room-code inline">{code}</span>
        <span className="member-count">👥 {state?.memberCount ?? 0}</span>
      </div>

      <form onSubmit={handleAdd} className="add-form">
        <input
          className="input"
          placeholder="Paste a YouTube link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          inputMode="url"
        />
        <button type="submit" className="btn btn-primary">Add</button>
      </form>
      {flash && <p className="flash-text">{flash}</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="now-card">
        <span className="now-label">Now playing</span>
        {current ? (
          <>
            <div className="now-row">
              <img src={current.thumbnail} alt="" className="queue-thumb" />
              <div className="queue-text">
                <span className="queue-title">{current.title}</span>
                <span className="queue-by">added by {current.addedBy}</span>
              </div>
            </div>
            <div className="control-buttons">
              <button className="btn btn-secondary" onClick={() => control(state?.isPlaying ? "pause" : "play")}>
                {state?.isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button className="btn btn-secondary" onClick={() => control("skip")}>⏭ Skip</button>
            </div>
          </>
        ) : (
          <p className="queue-empty">Nothing playing — add something!</p>
        )}
      </div>

      <div className="react-card">
        <span className="now-label">Send a reaction</span>
        <ReactionBar code={code} />
      </div>

      <div className="queue-panel">
        <h3>Up next · {queue.length}</h3>
        {queue.length === 0 ? (
          <p className="queue-empty">Queue is empty.</p>
        ) : (
          <ul className="queue-list">
            {queue.map((item) => (
              <li key={item.id} className="queue-item">
                <img src={item.thumbnail} alt="" className="queue-thumb" />
                <div className="queue-text">
                  <span className="queue-title">{item.title}</span>
                  <span className="queue-by">{item.addedBy}</span>
                </div>
                <div className="queue-actions">
                  <button className="icon-btn" title="Play next" onClick={() => bumpItem(item.id)}>⤴</button>
                  <button className="icon-btn" title="Remove" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Room;
