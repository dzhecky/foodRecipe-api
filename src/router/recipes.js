const express = require('express');
const { allRecipes, getRecipeById, showRecipeByIdUser, postRecipe, putRecipe, deleteRecipeId, myRecipes } = require('../controllers/recipes');
const verifyToken = require('../middleware/auth');
const { isActivated } = require('../middleware/isActivated');
const { recipeOwner, usersAndAdmin } = require('../middleware/roleUsers');
const upload = require('../middleware/upload');
const router = express.Router();

// All role
router.get('/', verifyToken, isActivated, allRecipes);
router.get('/detail/:id', verifyToken, isActivated, getRecipeById);
router.get('/:id', verifyToken, isActivated, showRecipeByIdUser);

// Only users and admin
router.post('/', verifyToken, isActivated, usersAndAdmin, upload.single('photo'), postRecipe);
router.get('/show/myrecipes', verifyToken, isActivated, usersAndAdmin, myRecipes);

// Only recipe owner admin
router.put('/:id', verifyToken, isActivated, recipeOwner, upload.single('photo'), putRecipe);
router.delete('/:id', verifyToken, isActivated, recipeOwner, deleteRecipeId);

module.exports = router;
