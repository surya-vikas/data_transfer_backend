const mongoose = require("mongoose");

const clipboardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    text: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: null,
    },
    pin: {
      type: String,
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clipboard", clipboardSchema);
