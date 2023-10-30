const express = require('express');
const recipes = require('./recipes');
const category = require('./category');
const router = express.Router();

router.use('/recipe', recipes);
router.use('/category', category);

module.exports = router;
