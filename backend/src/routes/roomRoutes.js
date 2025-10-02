const express = require("express");
const { createRoom, getRoom } = require("../controllers/roomController");

const router = express.Router();

router.post("/", createRoom);
router.get("/:id", getRoom);

module.exports = router;