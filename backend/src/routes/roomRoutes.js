const express = require("express");
const router = express.Router();
const { createRoom, getRoom } = require("../controllers/roomController");

router.post("/create-room", createRoom);
router.get("/:roomId", getRoom);

module.exports = router;