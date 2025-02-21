require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};
connectDb();

// app.use(express.json());
app.use(cors());
// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Enable cookies and other credentials
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ Ensure API routes are registered BEFORE the catch-all route
app.use("/users", require("./routes/user"));
app.use("/recipes", require("./routes/recipe")); // ✅ Corrected base route

// ✅ Move this to the end to avoid overriding API routes
app.get("/", (req, res) => {
  res.send("Welcome to backend food recipe app");
});

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
