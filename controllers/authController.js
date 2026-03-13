const bcrypt = require("bcryptjs");
const User = require("../models/user");

const MAX_LOGIN_LOGS = 5;
const DEFAULT_USER_EMAIL =
  process.env.DEFAULT_USER_EMAIL || "vault@clipbridge.local";
const DEFAULT_USER_PASSWORD =
  process.env.DEFAULT_USER_PASSWORD || process.env.SECRET_PIN || "1234";

function normalizeCoordinate(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function toLoginLog(status, latitude, longitude) {
  return {
    status,
    timestamp: new Date(),
    latitude: normalizeCoordinate(latitude),
    longitude: normalizeCoordinate(longitude),
  };
}

function getLatestLogs(logs) {
  return [...logs]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, MAX_LOGIN_LOGS);
}

async function getOrCreateDefaultUser(email) {
  let user = await User.findOne({ email });
  if (user) {
    return user;
  }

  if (email !== DEFAULT_USER_EMAIL) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_USER_PASSWORD, 10);
  user = await User.create({
    email: DEFAULT_USER_EMAIL,
    password: hashedPassword,
  });
  return user;
}

async function login(req, res) {
  try {
    const { email, password, latitude, longitude } = req.body;
    const normalizedEmail = (email || DEFAULT_USER_EMAIL).trim().toLowerCase();

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    const user = await getOrCreateDefaultUser(normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const newLog = toLoginLog(
      isPasswordValid ? "success" : "failed",
      latitude,
      longitude
    );

    // Keep only the latest entries to avoid unbounded growth.
    user.loginLogs = getLatestLogs([...user.loginLogs, newLog]);
    await user.save();

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong password." });
    }

    return res.status(200).json({
      message: "Login successful.",
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

module.exports = {
  login,
  MAX_LOGIN_LOGS,
};
