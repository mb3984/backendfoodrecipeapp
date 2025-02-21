require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const app = express();
const PORT = process.env.PORT || 3000;

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("connected to MongoDB....");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};
connectDb();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/", require("./routes/user"));
app.use("/", require("./routes/recipe"));
app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});

app.use("/", (req, res) => {
  res.send("Welcome to backend food recipe app");
});
