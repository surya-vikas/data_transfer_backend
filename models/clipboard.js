const mongoose = require("mongoose");

const clipboardSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  photo: {
    type: String, // photo file name
  },
  pin: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Clipboard", clipboardSchema);
