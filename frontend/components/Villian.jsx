import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {QRCodeCanvas} from "qrcode.react";

function Villian() {

  const location = useLocation();
  const [roomLink, setRoomLink] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomToken = params.get("room");

    if (roomToken) {
      const fullLink = `${window.location.origin}/host/${roomToken}`;
      setRoomLink(fullLink);

      localStorage.setItem(
        "roomData",
        JSON.stringify({ roomLink: fullLink, createdAt: Date.now() })
      );
    } else {
      const storedData = localStorage.getItem("roomData");
      if (storedData) {
        const { roomLink, createdAt } = JSON.parse(storedData);
        const oneDay = 24 * 60 * 60 * 1000;
        const age = Date.now() - createdAt;

        if (age > oneDay) {
          setExpired(true);
          localStorage.removeItem("roomData");
        } else {
          setRoomLink(roomLink);
        }
      }
    }
  }, [location.search]);

  const clearRoom = () => {
    localStorage.removeItem("roomData");
    setRoomLink("");
    alert("Room cleared from storage.");
  };

    return (
      <div className="video-form">
        <label htmlFor="video-url" className="form-title">
          Send a Video
        </label>
        <div>
        <QRCodeCanvas value={roomLink} size={180} />
          <p>Scan this QR to join the host’s room.</p>
        </div>
        <div className="input-wrapper">
          <input
            id="video-url"
            type="text"
            className="input" 
            placeholder="Paste YouTube link here"
          />
          <button className="button">Send</button>
        </div>
      </div>
    );
  }
  
  export default Villian;
  