const mongoose = require('mongoose');
const Schema = mongoose.Schema

const roomSchema = new Schema({
    roomID: {type: String},
    createdBy: {type: String, required: true}
})

module.exports = mongoose.model('Room', roomSchema);