// In-memory room store. Rooms are ephemeral watch-party sessions, so there's
// no database — everything lives here for the life of the server process.

const crypto = require("crypto");

/**
 * rooms: Map<code, {
 *   code: string,
 *   hostSocketId: string | null,
 *   current: Item | null,
 *   queue: Item[],
 *   isPlaying: boolean,
 *   members: Map<socketId, { name: string }>,
 *   createdAt: number,
 * }>
 *
 * Item: { id, videoId, title, thumbnail, addedBy }
 */
const rooms = new Map();

// Unambiguous alphabet (no 0/O, 1/I) for codes people type on a phone.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(length = 5) {
  let code;
  do {
    code = Array.from(
      { length },
      () => ALPHABET[crypto.randomInt(ALPHABET.length)]
    ).join("");
  } while (rooms.has(code));
  return code;
}

function createRoom() {
  const code = generateCode();
  const room = {
    code,
    hostSocketId: null,
    current: null,
    queue: [],
    isPlaying: false,
    members: new Map(),
    createdAt: Date.now(),
  };
  rooms.set(code, room);
  return room;
}

function getRoom(code) {
  if (!code) return null;
  return rooms.get(code.toUpperCase()) || null;
}

function setHost(code, socketId) {
  const room = getRoom(code);
  if (room) room.hostSocketId = socketId;
}

function addMember(code, socketId, name) {
  const room = getRoom(code);
  if (room) room.members.set(socketId, { name });
}

function removeMember(code, socketId) {
  const room = getRoom(code);
  if (room) room.members.delete(socketId);
}

function addVideo(code, meta) {
  const room = getRoom(code);
  if (!room) return null;
  const item = { id: crypto.randomUUID(), ...meta };
  // If nothing is playing, start immediately; otherwise queue it.
  if (!room.current) {
    room.current = item;
    room.isPlaying = true;
  } else {
    room.queue.push(item);
  }
  return item;
}

function removeVideo(code, id) {
  const room = getRoom(code);
  if (!room) return false;
  const before = room.queue.length;
  room.queue = room.queue.filter((v) => v.id !== id);
  return room.queue.length !== before;
}

function moveToFront(code, id) {
  const room = getRoom(code);
  if (!room) return false;
  const idx = room.queue.findIndex((v) => v.id === id);
  if (idx <= 0) return idx === 0; // already first (or not found -> false)
  const [item] = room.queue.splice(idx, 1);
  room.queue.unshift(item);
  return true;
}

// Advance to the next video in the queue (or stop if the queue is empty).
function advance(code) {
  const room = getRoom(code);
  if (!room) return null;
  room.current = room.queue.shift() || null;
  room.isPlaying = !!room.current;
  return room.current;
}

// Serializable snapshot sent to every client in the room.
function publicState(code) {
  const room = getRoom(code);
  if (!room) return null;
  return {
    code: room.code,
    current: room.current,
    queue: room.queue,
    isPlaying: room.isPlaying,
    members: [...room.members.values()].map((m) => m.name),
    memberCount: room.members.size,
    hasHost: !!room.hostSocketId,
  };
}

module.exports = {
  rooms,
  createRoom,
  getRoom,
  setHost,
  addMember,
  removeMember,
  addVideo,
  removeVideo,
  moveToFront,
  advance,
  publicState,
};
