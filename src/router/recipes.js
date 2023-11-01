const express = require('express');
const { allRecipes, getRecipeById, postRecipe, putRecipe, deleteRecipeId, myRecipes } = require('../controllers/recipes');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/', verifyToken, allRecipes);
router.get('/detail/:id', verifyToken, getRecipeById);
router.get('/show/myrecipes', verifyToken, myRecipes);
router.post('/', verifyToken, postRecipe);
router.put('/:id', verifyToken, putRecipe);
router.delete('/:id', verifyToken, deleteRecipeId);

module.exports = router;
