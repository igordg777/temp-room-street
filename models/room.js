const mongoose = require("mongoose");

const roomTempSchema = new mongoose.Schema({
  date: String,
  time: String,
  roomTemp: Number,
});

module.exports = mongoose.model('Room', roomTempSchema);