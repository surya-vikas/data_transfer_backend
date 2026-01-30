const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const app = express();
connectDB();

app.use(cors()); // 👈 THIS LINE IS VERY IMPORTANT
app.use(express.json());

const clipboardRoutes = require("./routes/clipboardRoutes");
app.use("/clipboard", clipboardRoutes);

app.get("/", (req, res) => {
  res.send("Hello! My app is working 🎉");
});

app.listen(5000, () => {
  console.log("Server started on 5000");
});
app.use("/uploads", express.static("uploads"));
