const express = require('express');

const { allCategory, getCategoryId } = require('../controllers/category');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, allCategory);
router.get('/:id', verifyToken, getCategoryId);

module.exports = router;
