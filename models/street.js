const mongoose = require("mongoose");

const streetTempSchema = new mongoose.Schema({
  date: String,
  time: String,
  streetTemp: Number,
});

module.exports = mongoose.model('Street', streetTempSchema);
