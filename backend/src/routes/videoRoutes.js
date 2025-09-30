const express = require("express");
const router = express.Router();
const { addVideo, getVideos} = require("../controllers/videoController")

router.post("/:roomId/videos", addVideo);
router.get("/:roomId/videos", getVideos);

module.exports = router;