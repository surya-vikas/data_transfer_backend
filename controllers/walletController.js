const mongoose = require("mongoose");
const WalletSet = require("../models/walletSet");

function verifyOtp(req, res) {
  const otp = String(req.body?.otp ?? "").trim();
  const walletAuthCode = String(process.env.WALLET_AUTH_CODE ?? "").trim();

  if (!walletAuthCode) {
    return res.status(500).json({
      success: false,
      message: "Wallet OTP is not configured.",
    });
  }

  if (otp !== walletAuthCode) {
    return res.status(400).json({
      success: false,
      message: "Invalid authentication code",
    });
  }

  return res.json({ success: true });
}

function verifyPassword(req, res) {
  const providedPassword = String(req.body?.password ?? "");
  const walletPassword = process.env.WALLET_PASSWORD;

  if (!walletPassword) {
    return res.status(500).json({
      success: false,
      message: "Wallet access is not configured.",
    });
  }

  if (providedPassword === walletPassword) {
    return res.json({ success: true });
  }

  return res.json({
    success: false,
    message: "Invalid password",
  });
}

async function getWalletSets(req, res) {
  try {
    const sets = await WalletSet.find({}).sort({ updatedAt: -1, _id: -1 });
    return res.json({
      success: true,
      sets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not load wallet sets.",
    });
  }
}

async function createWalletSet(req, res) {
  const name = String(req.body?.name ?? "").trim();

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Set name is required.",
    });
  }

  try {
    const set = await WalletSet.create({
      name,
      entries: [],
    });

    return res.status(201).json({
      success: true,
      set,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not create wallet set.",
    });
  }
}

async function addWalletEntry(req, res) {
  const setId = String(req.body?.setId ?? "").trim();
  const key = String(req.body?.key ?? "").trim();
  const value = String(req.body?.value ?? "").trim();

  if (!setId || !key || !value) {
    return res.status(400).json({
      success: false,
      message: "Set, key and value are required.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(setId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid set.",
    });
  }

  try {
    const set = await WalletSet.findByIdAndUpdate(
      setId,
      {
        $push: {
          entries: {
            key,
            value,
          },
        },
      },
      { new: true }
    );

    if (!set) {
      return res.status(404).json({
        success: false,
        message: "Set not found.",
      });
    }

    return res.status(201).json({
      success: true,
      set,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not add wallet entry.",
    });
  }
}

module.exports = {
  verifyOtp,
  verifyPassword,
  getWalletSets,
  createWalletSet,
  addWalletEntry,
};
