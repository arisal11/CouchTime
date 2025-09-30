const Room = require("../models/room.js");
const Video = require("../models/videos.js");

exports.createRoom = async (req, res) => {

    if(!req.session.userId){
        return res.status(401).json({error: "No session"})
    }

    const roomId = Math.random().toString(36).substring(2,8);

    const newRoom = new Room ({
        roomId,
        hostSessionId: req.session.userId
    });

    await newRoom.save();

    req.session.roomId = roomId;

    res.json({roomId});
}

exports.getRoom = async (req, res) => {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    const videos = await Video.find({ roomId });

    res.json({ room, videos });
};