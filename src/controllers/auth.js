const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, checkEmailRegistered } = require('../models/auth');
const { getUserByEmail } = require('../models/users');

const authController = {
  register: async (req, res) => {
    let { name, email, password, phone_number, photo } = req.body;

    if (!name || !email || !password || !phone_number || !photo) {
      return res.status(400).json({
        code: 400,
        message: 'name, email, password, phone_number and photo is required!',
      });
    }

    let checkEmail = await checkEmailRegistered(email);
    let checkEmailResult = checkEmail.rows[0].count;

    if (checkEmailResult > 0) {
      return res.status(400).json({
        code: 400,
        message: 'Email has been registered!',
      });
    }

    //   hash password
    let passwordHashed = await bcrypt.hash(password, 10);
    let data = { name, email, passwordHashed, phone_number, photo };
    await createUser(data);

    if (!data) {
      return res.status(404).json({
        code: 404,
        message: 'Register Failed!',
      });
    }

    res.status(200).json({
      code: 200,
      message: 'Register success!',
    });
  },

  login: async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: 'email and password is required!',
      });
    }

    //   Check email is registered?
    let checkEmail = await getUserByEmail(email);
    if (checkEmail.rows.length === 0) {
      return res.status(400).json({
        code: 400,
        message: 'Email not registered',
      });
    }

    //   Check password is match?
    let isMatch = bcrypt.compareSync(password, checkEmail.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({
        code: 400,
        message: 'Incorrect password, please enter the correct password',
      });
    }

    // Generate token
    const accessToken = jwt.sign(checkEmail.rows[0], process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign(checkEmail.rows[0], process.env.JWT_REFRESH_SECRET, { expiresIn: '1Y' });
    res.status(200).json({
      code: 200,
      message: 'Login success!',
      token: {
        accessToken,
        refreshToken,
      },
    });
  },

  refreshToken: async (req, res) => {
    let value = req.body;

    try {
      let decoded = jwt.verify(value.refreshToken, process.env.JWT_REFRESH_SECRET);
      let user = await getUserByEmail(decoded.email);

      if (!user) {
        res.status(404).json({
          code: 404,
          message: 'User not found!',
        });
      }

      let accessToken = jwt.sign(user.rows[0], process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(200).json({
        code: 200,
        message: 'Access token updated!',
        token: { accessToken },
      });
    } catch (error) {
      res.status(401).json({
        code: 401,
        message: error.message,
      });
    }
  },
};

module.exports = authController;
