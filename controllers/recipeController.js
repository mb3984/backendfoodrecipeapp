const multer = require("multer");
const path = require("path");
const Recipes = require("../models/recipeModel");
const mongoose = require("mongoose");

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

//   try {
//     console.log("Received Body:", req.body);
//     console.log("Received File:", req.file);

//     if (
//       !req.body.title ||
//       !req.body.ingredients ||
//       !req.body.instructions ||
//       !req.body.time
//     ) {
//       return res.status(400).json({ message: "All fields are required!" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Cover image is required!" });
//     }

//     // Ensure ingredients are parsed as an array
//     let ingredientsArray;
//     try {
//       ingredientsArray = Array.isArray(req.body.ingredients)
//         ? req.body.ingredients
//         : JSON.parse(req.body.ingredients || "[]");
//     } catch (parseError) {
//       console.error("Error parsing ingredients:", parseError);
//       return res.status(400).json({ message: "Invalid ingredients format" });
//     }

//     const newRecipe = await Recipes.create({
//       title: req.body.title,
//       ingredients: ingredientsArray, // Store array correctly
//       instructions: req.body.instructions,
//       time: req.body.time,
//       coverImage: req.file.filename,
//       createdBy: req.user?.id || "unknown",
//     });

//     console.log("Recipe added successfully:", newRecipe);
//     return res
//       .status(201)
//       .json({ message: "Recipe added successfully", newRecipe });
//   } catch (error) {
//     console.error("Error adding recipe:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Internal Server Error" });
//   }
// };

// const addRecipe = async (req, res) => {
//   try {
//     console.log("Received Body:", req.body);
//     console.log("Received File:", req.file);

//     if (
//       !req.body.title ||
//       !req.body.ingredients ||
//       !req.body.instructions ||
//       !req.body.time
//     ) {
//       return res.status(400).json({ message: "All fields are required!" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Cover image is required!" });
//     }

//     // Ensure ingredients are parsed as an array
//     let ingredientsArray;
//     try {
//       ingredientsArray = Array.isArray(req.body.ingredients)
//         ? req.body.ingredients
//         : JSON.parse(req.body.ingredients || "[]");
//     } catch (parseError) {
//       console.error("Error parsing ingredients:", parseError);
//       return res.status(400).json({ message: "Invalid ingredients format" });
//     }

//     // Store full image URL instead of just the filename
//     const coverImageURL = `${req.protocol}://${req.get("host")}/uploads/${
//       req.file.filename
//     }`;

//     const newRecipe = await Recipes.create({
//       title: req.body.title,
//       ingredients: ingredientsArray, // Store array correctly
//       instructions: req.body.instructions,
//       time: req.body.time,
//       coverImage: coverImageURL, // Store full URL
//       createdBy: req.user?.id || "unknown",
//     });

//     console.log("✅ Recipe added successfully:", newRecipe);
//     return res
//       .status(201)
//       .json({ message: "Recipe added successfully", newRecipe });
//   } catch (error) {
//     console.error("❌ Error adding recipe:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Internal Server Error" });
//   }
// };

const addRecipe = async (req, res) => {
  try {
    console.log("📥 Received Request - Body:", req.body);
    console.log("🖼️ Received File:", req.file);

    // Validate required fields
    const { title, ingredients, instructions, time } = req.body;
    if (!title || !ingredients || !instructions || !time) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required!" });
    }

    // Parse ingredients safely
    let ingredientsArray;
    if (typeof ingredients === "string") {
      try {
        ingredientsArray = JSON.parse(ingredients);
      } catch (err) {
        console.error("❌ Error parsing ingredients:", err);
        return res.status(400).json({ message: "Invalid ingredients format" });
      }
    } else {
      ingredientsArray = ingredients;
    }

    // Store full image URL
    const coverImageURL = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    // Create recipe
    const newRecipe = await Recipes.create({
      title,
      ingredients: ingredientsArray,
      instructions,
      time,
      coverImage: coverImageURL,
      createdBy: req.user?.id || "unknown",
    });

    console.log("✅ Recipe added successfully:", newRecipe);
    return res
      .status(201)
      .json({ message: "Recipe added successfully", newRecipe });
  } catch (error) {
    console.error("❌ Error adding recipe:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// const editRecipe = async (req, res) => {
//   try {
//     const { title, ingredients, instructions, time } = req.body;
//     let recipe = await Recipes.findById(req.params.id);

//     if (!recipe) {
//       return res.status(404).json({ message: "Recipe not found" });
//     }

//     let coverImage = req.file?.filename ? req.file.filename : recipe.coverImage;
//     const updatedRecipe = await Recipes.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, coverImage },
//       { new: true }
//     );

//     console.log("Recipe edited successfully:", updatedRecipe);

//     res.json(updatedRecipe);
//   } catch (err) {
//     console.error("Error updating recipe:", err);
//     return res
//       .status(500)
//       .json({ message: "Error updating recipe", error: err });
//   }
// };

const editRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;
    let recipe = await Recipes.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    let ingredientsArray;
    try {
      ingredientsArray = Array.isArray(ingredients)
        ? ingredients
        : JSON.parse(ingredients || "[]");
    } catch (parseError) {
      console.error("Error parsing ingredients:", parseError);
      return res.status(400).json({ message: "Invalid ingredients format" });
    }

    let coverImage = recipe.coverImage;
    if (req.file) {
      coverImage = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      {
        title,
        ingredients: ingredientsArray,
        instructions,
        time,
        coverImage,
      },
      { new: true }
    );

    console.log("✅ Recipe updated successfully:", updatedRecipe);
    res.json({ message: "Recipe updated successfully", updatedRecipe });
  } catch (err) {
    console.error("❌ Error updating recipe:", err);
    return res
      .status(500)
      .json({ message: "Error updating recipe", error: err });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("➡️ Received DELETE request for ID:", id); // ✅ Log request received

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid ObjectId received:", id);
      return res.status(400).json({ message: "Invalid ID format" });
    }

    console.log("✅ ObjectId is valid. Checking database connection...");
    if (mongoose.connection.readyState !== 1) {
      console.log("❌ Database is not connected!");
      return res.status(500).json({ message: "Database not connected" });
    }

    console.log("✅ Database connected. Checking if recipe exists...");
    const recipe = await Recipes.findById(id);
    if (!recipe) {
      console.log("❌ Recipe not found in database!");
      return res.status(404).json({ message: "Recipe not found" });
    }

    console.log("✅ Recipe found! Proceeding to delete...");
    const result = await Recipes.deleteOne({ _id: id });
    console.log("🗑️ Delete result:", result);

    if (result.deletedCount === 0) {
      console.log("❌ No recipe was deleted.");
      return res.status(404).json({ message: "Recipe not found" });
    }

    console.log("✅ Recipe deleted successfully:", id);
    res.json({ message: "Deleted successfully", status: "ok" });
  } catch (err) {
    console.error("❌ Error deleting recipe:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
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
