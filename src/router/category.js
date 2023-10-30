const express = require('express');

const { allCategory, getCategoryId, inputCategory, putCategory, deleteCategoryId } = require('../controllers/category');

const router = express.Router();

router.get('/', allCategory);
router.get('/:id', getCategoryId);
router.post('/', inputCategory);
router.put('/:id', putCategory);
router.delete('/:id', deleteCategoryId);

module.exports = router;
