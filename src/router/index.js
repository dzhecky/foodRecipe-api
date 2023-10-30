const express = require('express');
const recipes = require('./recipes');
const router = express.Router();

router.use('/recipe', recipes);

module.exports = router;
