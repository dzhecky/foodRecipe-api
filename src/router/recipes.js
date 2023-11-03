const express = require('express');
const { allRecipes, getRecipeById, postRecipe, putRecipe, deleteRecipeId, myRecipes } = require('../controllers/recipes');
const verifyToken = require('../middleware/auth');
const { onlyUsers, mySelf, recipeOwner } = require('../middleware/roleUsers');
const router = express.Router();

// All role
router.get('/', verifyToken, allRecipes);
router.get('/detail/:id', verifyToken, getRecipeById);

// Only users
router.post('/', verifyToken, onlyUsers, postRecipe);
router.get('/show/myrecipes', verifyToken, onlyUsers, myRecipes);

// Only recipe owner
router.put('/:id', verifyToken, recipeOwner, putRecipe);
router.delete('/:id', verifyToken, recipeOwner, deleteRecipeId);

module.exports = router;
