// const express = require("express");
// const {
//   getRecipes,
//   getRecipe,
//   addRecipe,
//   editRecipe,
//   deleteRecipe,
//   upload,
// } = require("../controllers/recipeController");
// const verifyToken = require("../middleware/auth");
// const router = express.Router();

// router.get("/getRecipes", getRecipes); //Get all recipes
// router.get("/getRecipe/:id", getRecipe); //Get recipe by id
// router.post(
//   "/save/recipe",
//   upload.single("coverImage"),
//   verifyToken,
//   addRecipe
// ); //add recipe
// router.put("/updateRecipe/:id", upload.single("coverImage"), editRecipe); //Edit recipe
// router.delete("/deleteRecipe/:id", deleteRecipe); //Delete recipe

// module.exports = router;

const express = require("express");
const {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
} = require("../controllers/recipeController");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get("/getAll", getRecipes); // Get all recipes
router.get("/get/:id", getRecipe); // Get recipe by ID
router.post("/post", upload.single("coverImage"), verifyToken, addRecipe); // Add recipe
router.put("/update/:id", upload.single("coverImage"), verifyToken, editRecipe); // Edit recipe
router.delete("/delete/:id", verifyToken, deleteRecipe); // Delete recipe

module.exports = router;
