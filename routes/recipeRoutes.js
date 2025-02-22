const express = require("express");
const upload = require("../config/multer");
const Recipe = require("../models/recipeModel");

const router = express.Router();

// Route to add a recipe with an image
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file.path; // Cloudinary image URL

    const newRecipe = new Recipe({ title, description, image: imageUrl });
    await newRecipe.save();

    res
      .status(201)
      .json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
