const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    loginLogs: {
      type: [loginLogSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
