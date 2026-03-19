const mongoose = require("mongoose");

const walletEntrySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const walletSetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    entries: {
      type: [walletEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "walletData",
  }
);

module.exports = mongoose.model("WalletSet", walletSetSchema);
