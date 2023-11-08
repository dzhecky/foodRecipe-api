const express = require('express');
const { register, setActivateUser, login, refreshToken } = require('../controllers/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register', upload.single('photo'), register);
router.get('/activate/:id', setActivateUser);
router.post('/login', login);
router.post('/refresh', refreshToken);

module.exports = router;
