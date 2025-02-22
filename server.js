require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const recipeRoutes = require("./routes/recipe"); // ✅ Fixed import
const recipeRoutesAlt = require("./routes/recipeRoutes"); // ✅ Renamed to avoid conflict
const userRoutes = require("./routes/user");

// ✅ Connect to MongoDB
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("✅ Connected to MongoDB...");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};
connectDb();

// ✅ Configure CORS
const corsOptions = {
  origin: "*", // Change to frontend URL for security
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Register API Routes
app.use("/recipes", recipeRoutes); // Handles routes like `/recipes/post`
app.use("/api/recipes", recipeRoutesAlt); // Handles `/api/recipes/add`
app.use("/user", userRoutes); // Use `/user/signUp` instead of `/signUp`

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the backend food recipe app");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT: ${PORT}`);
});
