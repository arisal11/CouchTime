import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { socket } from "../src/socket.js";
import YouTubePlayer from "../components/YouTubePlayer.jsx";
import ReactionOverlay from "../components/ReactionOverlay.jsx";
import ReactionRail from "../components/ReactionRail.jsx";

const SLATS = Array.from({ length: 16 });

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
    <div className="host-page">
      <ReactionOverlay />

      <div className="living-room">
        {/* Window with venetian blinds (open = light, closed = dark) */}
        <div className="window" aria-hidden="true">
          <span className="sky-sun" />
          <span className="sky-moon" />
          <span className="sky-star s1" />
          <span className="sky-star s2" />
          <span className="sky-star s3" />
          <span className="sky-star s4" />
          <div className="blinds">
            {SLATS.map((_, i) => (
              <span className="slat" key={i} />
            ))}
          </div>
          <div className="blinds-rail" />
          <div className="blinds-cord" />
        </div>

        {/* What's up next, framed on the left wall */}
        <div className="wall-frame queue-frame">
          <span className="frame-label">Up Next</span>
          {queue.length === 0 ? (
            <p className="frame-empty">Nothing queued</p>
          ) : (
            <ul className="wall-queue">
              {queue.slice(0, 5).map((item, i) => (
                <li key={item.id}>
                  <span className="q-num">{i + 1}</span>
                  <span className="q-title">{item.title}</span>
                </li>
              ))}
              {queue.length > 5 && (
                <li className="q-more">+{queue.length - 5} more</li>
              )}
            </ul>
          )}
        </div>

        {/* Join instructions, framed on the right wall */}
        <div className="wall-frame qr-frame">
          <div className="qr-box">
            <QRCodeCanvas value={joinUrl} size={168} />
          </div>
          <span className="frame-code">{code}</span>
          <span className="frame-hint">scan to join</span>
          <span className="frame-count">👥 {state?.memberCount ?? 0} watching</span>
        </div>

        {/* The big TV on its stand */}
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
                  <span>Add a video from your phone to start watching</span>
                </div>
              )}
              {current && (
                <button className="tv-skip" onClick={skip} title="Skip video">
                  ⏭
                </button>
              )}
            </div>
            <ReactionRail />
            <span className="tv-brand">CouchTime</span>
          </div>
          <div className="tv-neck" />
          <div className="tv-base" />
        </div>
      </div>
    </div>
  );
}

export default Host;
