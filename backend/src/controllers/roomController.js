const Room = require("../models/room.js");
const Video = require("../models/videos.js");

exports.createRoom = async (req, res) => {
    try {
        if (!req.session.userId) {
            req.session.userId = Math.random().toString(36).substring(2, 12);
        }
    
        const newRoom = new Room({
            createdBy: req.body.name
        });
    
        await newRoom.save();
    
        req.session.roomID = newRoom._id;
    
        res.json({ roomId: newRoom._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create room" });
    }
}

exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if(!room){
            return res.status(404).json({error: "room not found"});
        }

        res.json({room})
    } catch (error) {
        res.status(400).json({error:"Invalid room id"})
    }
};