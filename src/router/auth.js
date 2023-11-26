const express = require('express');
const { register, setActivateUser, login, refreshToken, forgotPassword } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.get('/activate/:id', setActivateUser);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/refresh', refreshToken);

module.exports = router;
