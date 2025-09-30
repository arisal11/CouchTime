const mongoose = require('mongoose');
const Schema = mongoose.Schema

const roomSchema = new Schema({
    roomID: {type: Number, required: true, unique: true},
    hostSessionId: { type: String, required: true },
    link: {type: String, required: true, }
})

module.exports = mongoose.model('Room', roomSchema);