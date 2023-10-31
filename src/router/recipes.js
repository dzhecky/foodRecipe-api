const express = require('express');
const { allRecipes, getRecipeId, inputRecipe, putRecipe, deleteRecipeId, myRecipes } = require('../controllers/recipes');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/', verifyToken, allRecipes);
router.get('/:id', verifyToken, getRecipeId);
router.get('/show/myrecipes', verifyToken, myRecipes);
router.post('/', verifyToken, inputRecipe);
router.put('/:id', verifyToken, putRecipe);
router.delete('/:id', verifyToken, deleteRecipeId);

module.exports = router;
