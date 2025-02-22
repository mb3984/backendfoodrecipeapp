require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/user");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING); // ✅ Remove deprecated options
    console.log("✅ Connected to MongoDB...");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit on failure
  }
};
connectDb();

// ✅ Configure CORS properly
const corsOptions = {
  origin: "*", // Replace with frontend origin if needed
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions)); // ✅ Use only one CORS middleware

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Register API Routes
app.use("/recipes", recipeRoutes);
app.use("/recipes", recipe);
app.use("/", userRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the backend food recipe app");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT: ${PORT}`);
});
