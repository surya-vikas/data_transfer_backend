const express = require("express");
const {
  verifyOtp,
  verifyPassword,
  getWalletSets,
  createWalletSet,
  addWalletEntry,
} = require("../controllers/walletController");

const router = express.Router();

router.post("/verify-otp", verifyOtp);
router.post("/verify-password", verifyPassword);
router.get("/", getWalletSets);
router.post("/set", createWalletSet);
router.post("/entry", addWalletEntry);

module.exports = router;
