const mongoose = require('mongoose');
const Schema = mongoose.Schema

const videoSchema = new Schema({
    roomID: {type: String, required: true},
    link: {type: String, required: true}
})

module.exports = mongoose.model('Video', videoSchema);