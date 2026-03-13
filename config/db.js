const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.SURYA_DB);
    console.log("MongoDB connected 🧠");
  } catch (error) {
    console.log("MongoDB error ❌");
  }
};

module.exports = connectDB;
