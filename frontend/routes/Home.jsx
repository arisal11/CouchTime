import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../src/socket.js";

function Home() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const handleHost = () => {
    setCreating(true);
    setError("");
    socket.emit("host:create", {}, (res) => {
      setCreating(false);
      if (res?.ok) {
        navigate(`/host/${res.code}`);
      } else {
        setError("Couldn't create a room. Is the server running?");
      }
    });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setError("");
    // Verify the room exists before navigating.
    socket.emit("room:join", { code: clean, name: "Guest" }, (res) => {
      if (res?.ok) {
        navigate(`/room/${clean}`);
      } else {
        setError("No room with that code. Double-check and try again.");
      }
    });
  };

  return (
    <div className="home">
      <section className="hero-copy">
        <h1>Gather your friends and watch together</h1>
        <p>
          Host a room on your TV, then everyone drops YouTube links from their
          phone into a shared queue. CouchTime plays them back-to-back on the
          big screen.
        </p>
      </section>

      <div className="home-cards">
        <div className="card card-host">
          <div className="card-icon">📺</div>
          <h2>Host a room</h2>
          <p>Open this on the screen everyone can see — your TV, laptop or monitor.</p>
          <button className="btn btn-primary" onClick={handleHost} disabled={creating}>
            {creating ? "Creating…" : "Start hosting"}
          </button>
        </div>

        <div className="card card-join">
          <div className="card-icon">📱</div>
          <h2>Join a room</h2>
          <p>Got a room code from the host? Enter it to add videos to the queue.</p>
          <form onSubmit={handleJoin} className="join-row">
            <input
              className="input code-input"
              placeholder="ROOM CODE"
              value={code}
              maxLength={6}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <button type="submit" className="btn btn-secondary">Join</button>
          </form>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Home;
