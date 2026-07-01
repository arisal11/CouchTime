require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const {
  createRoom,
  getRoom,
  addMember,
  removeMember,
  setHost,
  addVideo,
  removeVideo,
  advance,
  moveToFront,
  publicState,
} = require("./rooms");
const { fetchVideoMeta } = require("./youtube");

// In dev we reflect whatever origin the request came from so phones on the LAN
// (loading the app via the host's IP) aren't blocked. Set CLIENT_ORIGIN to lock
// this down to a single origin in production.
// Emoji reactions allowed in a room (kept in sync with the frontend list).
const ALLOWED_REACTIONS = new Set([
  "❤️", "😂", "🔥", "👏", "😮", "🎉", "💯", "😍",
]);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || true;

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// Quick REST check that a room exists before a phone commits to joining.
app.get("/api/rooms/:code", (req, res) => {
  const room = getRoom(req.params.code);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json({ code: room.code, exists: true });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN, credentials: true },
});

// Push the authoritative room state to everyone in the room.
function broadcast(code) {
  const state = publicState(code);
  if (state) io.to(code).emit("room:state", state);
}

io.on("connection", (socket) => {
  // --- Host opens the TV page ---------------------------------------------
  // Creates a brand new room and claims host.
  socket.on("host:create", (_payload, cb) => {
    const room = createRoom();
    setHost(room.code, socket.id);
    socket.join(room.code);
    socket.data.code = room.code;
    socket.data.role = "host";
    if (typeof cb === "function") cb({ ok: true, code: room.code });
    broadcast(room.code);
  });

  // Host page reloaded / reopened for an existing room: re-claim host.
  socket.on("host:resume", ({ code }, cb) => {
    const room = getRoom(code);
    if (!room) {
      if (typeof cb === "function") cb({ ok: false, error: "Room not found" });
      return;
    }
    setHost(code, socket.id);
    socket.join(code);
    socket.data.code = code;
    socket.data.role = "host";
    if (typeof cb === "function") cb({ ok: true, state: publicState(code) });
    broadcast(code);
  });

  // --- Phone joins as a remote --------------------------------------------
  socket.on("room:join", ({ code, name }, cb) => {
    const room = getRoom(code);
    if (!room) {
      if (typeof cb === "function") cb({ ok: false, error: "Room not found" });
      return;
    }
    const cleanName = (name || "Guest").toString().trim().slice(0, 24) || "Guest";
    addMember(code, socket.id, cleanName);
    socket.join(code);
    socket.data.code = code;
    socket.data.role = "guest";
    socket.data.name = cleanName;
    if (typeof cb === "function") cb({ ok: true, state: publicState(code) });
    broadcast(code);
  });

  // --- Add a video to the queue -------------------------------------------
  socket.on("video:add", async ({ code, url }, cb) => {
    const room = getRoom(code);
    if (!room) {
      if (typeof cb === "function") cb({ ok: false, error: "Room not found" });
      return;
    }
    const meta = await fetchVideoMeta(url);
    if (!meta) {
      if (typeof cb === "function")
        cb({ ok: false, error: "That doesn't look like a valid YouTube link" });
      return;
    }
    const addedBy = socket.data.name || "Host";
    const item = addVideo(code, { ...meta, addedBy });
    if (typeof cb === "function") cb({ ok: true, item });
    broadcast(code);
  });

  // --- Remove a queued item -----------------------------------------------
  socket.on("video:remove", ({ code, id }) => {
    if (removeVideo(code, id)) broadcast(code);
  });

  // Bump a queued item to play next.
  socket.on("video:next-up", ({ code, id }) => {
    if (moveToFront(code, id)) broadcast(code);
  });

  // --- Playback control ----------------------------------------------------
  // The host page is the actual YouTube player. Remotes send commands that
  // get relayed to the host socket; the host applies them and syncs back.
  socket.on("player:control", ({ code, action }) => {
    const room = getRoom(code);
    if (!room) return;
    if (action === "skip") {
      advance(code);
      broadcast(code);
      return;
    }
    if (room.hostSocketId) {
      io.to(room.hostSocketId).emit("host:command", { action });
    }
  });

  // Host reports its player state (playing/paused) so remotes stay in sync.
  socket.on("player:sync", ({ code, isPlaying }) => {
    const room = getRoom(code);
    if (!room) return;
    room.isPlaying = !!isPlaying;
    broadcast(code);
  });

  // Host reports the current video finished -> advance the queue.
  socket.on("player:ended", ({ code }) => {
    advance(code);
    broadcast(code);
  });

  // --- Reactions -----------------------------------------------------------
  // Broadcast an emoji to everyone in the room so it rains across the TV.
  socket.on("reaction:send", ({ code, emoji }) => {
    const room = getRoom(code);
    if (!room || !ALLOWED_REACTIONS.has(emoji)) return;
    io.to(code).emit("reaction", { emoji, from: socket.data.name || "Host" });
  });

  socket.on("disconnect", () => {
    const code = socket.data.code;
    if (!code) return;
    if (socket.data.role === "guest") removeMember(code, socket.id);
    broadcast(code);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`CouchTime backend running on :${PORT}`));
