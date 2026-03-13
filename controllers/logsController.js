const mongoose = require("mongoose");
const User = require("../models/user");
const { MAX_LOGIN_LOGS } = require("./authController");

async function fetchLatestLogsForUser(userId) {
  const user = await User.findById(userId).select("loginLogs");
  if (!user) {
    return null;
  }

  const latestLogs = [...user.loginLogs]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, MAX_LOGIN_LOGS);

  return latestLogs;
}

async function getUserLogs(req, res) {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const latestLogs = await fetchLatestLogsForUser(userId);
    if (!latestLogs) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ userId, logs: latestLogs });
  } catch (error) {
    console.error("Fetch logs failed:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

async function getUserLogsByQuery(req, res) {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid userId is required." });
    }

    const latestLogs = await fetchLatestLogsForUser(userId);
    if (!latestLogs) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ userId, logs: latestLogs });
  } catch (error) {
    console.error("Fetch logs failed:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

module.exports = {
  getUserLogs,
  getUserLogsByQuery,
};
