const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    type: String,
    price: Number,
    available: Number
});

module.exports = mongoose.model('Room', roomSchema);