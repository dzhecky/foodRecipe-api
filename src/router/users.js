const express = require('express');
const { getAllUsers, getUsersById, deleteUser, updateUser } = require('../controllers/users');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUsersById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
