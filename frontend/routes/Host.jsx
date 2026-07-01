import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { socket } from "../src/socket.js";
import YouTubePlayer from "../components/YouTubePlayer.jsx";
import ReactionOverlay from "../components/ReactionOverlay.jsx";
import ReactionBar from "../components/ReactionBar.jsx";

function Host() {
  const { code } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [state, setState] = useState(null);
  const [missing, setMissing] = useState(false);

  const joinUrl = `${window.location.origin}/room/${code}`;

  useEffect(() => {
    const claimHost = () => {
      socket.emit("host:resume", { code }, (res) => {
        if (res?.ok) {
          setState(res.state);
          setMissing(false);
        } else {
          setMissing(true);
        }
      });
    };

    claimHost();
    // Re-claim host after a reconnect (e.g. server restart or network blip).
    socket.on("connect", claimHost);

    const onState = (s) => {
      if (s.code === code) setState(s);
    };
    socket.on("room:state", onState);

    // Remotes can control playback; the host page is the real player.
    const onCommand = ({ action }) => {
      if (action === "play") playerRef.current?.play();
      if (action === "pause") playerRef.current?.pause();
    };
    socket.on("host:command", onCommand);

    return () => {
      socket.off("connect", claimHost);
      socket.off("room:state", onState);
      socket.off("host:command", onCommand);
    };
  }, [code]);

  const handleEnded = () => socket.emit("player:ended", { code });
  const handlePlayerState = (data) => {
    // 1 = playing, 2 = paused
    if (data === 1) socket.emit("player:sync", { code, isPlaying: true });
    if (data === 2) socket.emit("player:sync", { code, isPlaying: false });
  };

  const togglePlay = () => {
    if (state?.isPlaying) playerRef.current?.pause();
    else playerRef.current?.play();
  };
  const skip = () => socket.emit("player:control", { code, action: "skip" });

  if (missing) {
    return (
      <div className="notice">
        <h2>This room is no longer active</h2>
        <p>The host session ended. Start a fresh room to keep watching.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back home
        </button>
      </div>
    );
  }

  const current = state?.current;
  const queue = state?.queue || [];

  return (
    <div className="living-room">
      <ReactionOverlay />

      {/* Decorative room backdrop: window + curtains, lamp, plant, rug */}
      <div className="lr-scene" aria-hidden="true">
        <div className="window-sky">
          <span className="sky-sun" />
          <span className="sky-moon" />
          <span className="sky-star s1" />
          <span className="sky-star s2" />
          <span className="sky-star s3" />
          <span className="sky-star s4" />
        </div>
        <div className="curtain-rod" />
        <div className="curtain curtain-left" />
        <div className="curtain curtain-right" />

        <div className="floor-lamp">
          <span className="lamp-shade" />
          <span className="lamp-pole" />
          <span className="lamp-base" />
        </div>

        <div className="plant">
          <span className="leaf leaf-1" />
          <span className="leaf leaf-2" />
          <span className="leaf leaf-3" />
          <span className="pot" />
        </div>

        <div className="rug" />
      </div>

      {/* The living room's centrepiece: the TV on its console */}
      <div className="lr-stage">
        <div className="tv-unit">
          <div className="tv">
            <div className="tv-screen">
              {current ? (
                <YouTubePlayer
                  ref={playerRef}
                  videoId={current.videoId}
                  onEnded={handleEnded}
                  onStateChange={handlePlayerState}
                />
              ) : (
                <div className="tv-idle">
                  <div className="tv-idle-mark">📺</div>
                  <p>Queue is empty</p>
                  <span>Add a video from your phone to get started</span>
                </div>
              )}
            </div>
            <span className="tv-brand">CouchTime</span>
          </div>
          <div className="console">
            <span className="console-panel" />
            <span className="console-panel" />
            <span className="console-panel" />
          </div>
        </div>

        {current && (
          <div className="now-controls">
            <div className="now-meta">
              <span className="now-label">Now playing</span>
              <span className="now-title">{current.title}</span>
              <span className="now-by">added by {current.addedBy}</span>
            </div>
            <div className="control-buttons">
              <button className="btn btn-secondary" onClick={togglePlay}>
                {state?.isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button className="btn btn-secondary" onClick={skip}>
                ⏭ Skip
              </button>
            </div>
          </div>
        )}

        <ReactionBar code={code} />
      </div>

      {/* Info hung on the wall like framed art + a shelf of what's up next */}
      <aside className="lr-panel">
        <div className="poster">
          <div className="poster-qr">
            <QRCodeCanvas value={joinUrl} size={116} />
          </div>
          <div className="poster-info">
            <span className="join-label">Scan to join</span>
            <span className="room-code">{code}</span>
            <span className="join-url">{window.location.host}/room/{code}</span>
            <span className="member-count">
              👥 {state?.memberCount ?? 0} watching
            </span>
          </div>
        </div>

        <div className="queue-panel shelf">
          <h3>Up next · {queue.length}</h3>
          {queue.length === 0 ? (
            <p className="queue-empty">Nothing queued yet.</p>
          ) : (
            <ul className="queue-list">
              {queue.map((item) => (
                <li key={item.id} className="queue-item">
                  <img src={item.thumbnail} alt="" className="queue-thumb" />
                  <div className="queue-text">
                    <span className="queue-title">{item.title}</span>
                    <span className="queue-by">{item.addedBy}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

export default Host;
