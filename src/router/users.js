const express = require('express');
const { getAllUsers, getUsersById, deleteUser, updateUser } = require('../controllers/users');
const verifyToken = require('../middleware/auth');
const { mySelf } = require('../middleware/roleUsers');

const router = express.Router();

// All role
router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUsersById);

// Only owner
router.put('/:id', verifyToken, mySelf, updateUser);
router.delete('/:id', verifyToken, mySelf, deleteUser);

module.exports = router;
