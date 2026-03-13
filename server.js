const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const clipboardRoutes = require("./routes/clipboardRoutes");
const authRoutes = require("./routes/authRoutes");
const logsRoutes = require("./routes/logsRoutes");

app.use("/clipboard", clipboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/login", authRoutes);
app.use("/api/logs", logsRoutes);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(5000, () => {
  console.log("Server started on 5000");
});
