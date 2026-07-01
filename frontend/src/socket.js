import { io } from "socket.io-client";

// Where the backend lives. Priority:
//   1. VITE_SERVER_URL (explicit override, e.g. a deployed backend)
//   2. Same hostname the page was loaded from, on the backend port.
// Using the current hostname (instead of hard-coding localhost) is what lets
// phones on the same Wi-Fi reach the backend when the host loads the app via
// its LAN IP.
const BACKEND_PORT = import.meta.env.VITE_SERVER_PORT || "5001";
const URL =
  import.meta.env.VITE_SERVER_URL ||
  `${window.location.protocol}//${window.location.hostname}:${BACKEND_PORT}`;

export const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export const SERVER_URL = URL;
