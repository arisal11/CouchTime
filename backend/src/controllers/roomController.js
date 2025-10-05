require("dotenv").config();
const jwt = require("jsonwebtoken");
const Room = require("../models/room.js");
const Video = require("../models/videos.js");

exports.createRoom = async (req, res) => {
    try {
        
        if(!req.body.name){
            return res.status(400).json({error: "A rooms name is required"})
        }
    
        const newRoom = new Room({
            roomID: req.body.name,
            createdBy: req.body.name
        });
    
        await newRoom.save();

        const token = jwt.sign(
            { id: newRoom._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
    
        res.json({ roomID: token, roomLink: `http://localhost:5173/host/${token}`});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create room" });
    }
}

exports.getRoom = async (req, res) => {
    try {

        const decoded = jwt.verify(req.params.id, process.env.JWT_SECRET);
        const room = await Room.findById(decoded.id);
        if(!room){
            return res.status(404).json({error: "room not found"});
        }

        res.json({room})
    } catch (error) {
        res.status(400).json({error:"Invalid room id"})
    }
};

exports.joinRoom = async (req, res) =>{

}