const express = require('express');

const { allCategory, getCategoryId, inputCategory, putCategory, deleteCategoryId } = require('../controllers/category');
const verifyToken = require('../middleware/auth');
const { onlyAdmin } = require('../middleware/roleUsers');

const router = express.Router();

// All role
router.get('/', verifyToken, allCategory);
router.get('/:id', verifyToken, getCategoryId);

// Only admin
router.post('/', verifyToken, onlyAdmin, inputCategory);
router.put('/:id', verifyToken, onlyAdmin, putCategory);
router.delete('/:id', verifyToken, onlyAdmin, deleteCategoryId);

module.exports = router;
