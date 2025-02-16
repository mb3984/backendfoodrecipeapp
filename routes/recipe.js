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

router.get("/getRecipes", getRecipes); //Get all recipes
router.get("/getRecipe/:id", getRecipe); //Get recipe by id
router.post(
  "/save/recipe",
  upload.single("coverImage"),
  verifyToken,
  addRecipe
); //add recipe
router.put("/updateRecipe/:id", upload.single("coverImage"), editRecipe); //Edit recipe
router.delete("/deleteRecipe/:id", deleteRecipe); //Delete recipe

module.exports = router;
