const express = require('express');
const { allRecipes, getRecipeId, inputRecipe, putRecipe, deleteRecipeId } = require('../controllers/recipes');

const router = express.Router();

router.get('/', allRecipes);
router.get('/:id', getRecipeId);
router.post('/', inputRecipe);
router.put('/:id', putRecipe);
router.delete('/:id', deleteRecipeId);

module.exports = router;
