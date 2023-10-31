const express = require('express');

const { allCategory, getCategoryId, inputCategory, putCategory, deleteCategoryId } = require('../controllers/category');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, allCategory);
router.get('/:id', verifyToken, getCategoryId);
router.post('/', verifyToken, inputCategory);
router.put('/:id', verifyToken, putCategory);
router.delete('/:id', verifyToken, deleteCategoryId);

module.exports = router;
