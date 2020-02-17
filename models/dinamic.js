const mongoose = require("mongoose");

const dinamicSchema = new mongoose.Schema({
  dinamic: Array,
});

module.exports = mongoose.model('Dinamic', dinamicSchema);