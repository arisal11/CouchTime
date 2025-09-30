const Room = require("../models/room.js");
const Video = require("../models/videos.js");

exports.addVideo = async (req, res) => {
    const {roomId} = req.params;
    const {videoUrl} = req.body;

    const room = await Room.findOne({roomID});
    if(!room){
        return res.status(404).json({error: "Room not found"})
    }

    const newVideo = new Video({
        roomId,
        link: videoUrl
    })

    await newVideo.save()

    res.json(newVideo)
}

exports.getVideos = async (req, res) => {
    const { roomId } = req.params;

    const videos = await Video.find({ roomId });

    res.json(videos);
};