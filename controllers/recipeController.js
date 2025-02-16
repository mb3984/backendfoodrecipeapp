const multer = require("multer");
const path = require("path");
const Recipes = require("../models/recipeModel");

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure "uploads" folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Middleware
const upload = multer({ storage, fileFilter });

const getRecipes = async (req, res) => {
  const recipes = await Recipes.find();
  console.log(recipes);
  return res.json(recipes);
};

const getRecipe = async (req, res) => {
  const recipe = await Recipes.findById(req.params.id);
  res.json(recipe);
};

const addRecipe = async (req, res) => {
  try {
    console.log("Received Body:", req.body);
    console.log("Received File:", req.file);

    if (
      !req.body.title ||
      !req.body.ingredients ||
      !req.body.instructions ||
      !req.body.time
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required!" });
    }

    const newRecipe = await Recipes.create({
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      time: req.body.time,
      coverImage: req.file.filename, // Store only filename
      createdBy: req.user?.id || "unknown",
    });

    console.log("Recipe added successfully:", newRecipe);
    return res
      .status(201)
      .json({ message: "Recipe added successfully", newRecipe });
  } catch (error) {
    console.error("Error adding recipe:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const editRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body;
  let recipe = await Recipes.findById(req.params.id);

  try {
    if (recipe) {
      let coverImage = req.file?.filename
        ? req.file?.filename
        : recipe.coverImage;
      await Recipes.findByIdAndUpdate(
        req.params.id,
        { ...req.body, coverImage },
        { new: true }
      );
      console.log(
        "recipe edited succesfully",
        title,
        ingredients,
        instructions,
        time
      );
      res.json({ title, ingredients, instructions, time });
    }
  } catch (err) {
    return res.status(404).json({ message: err });
  }
};
const deleteRecipe = async (req, res) => {
  try {
    const id = req.params.id; // Get ID from URL
    const result = await Recipes.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    console.log("Recipe deleted successfully:", id);
    res.json({ message: "Deleted successfully", status: "ok" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
};
