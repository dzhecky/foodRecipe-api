const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { createUser, checkEmailRegistered, checkUserIsActive, activateUser } = require('../models/auth');
const { getUserByEmail } = require('../models/users');
const { sendMail } = require('../utils/sendMail');
const cloudinary = require('../config/photo');

const authController = {
  register: async (req, res) => {
    let { name, email, password, phone_number } = req.body;

    if (!req.file) {
      return res.status(400).json({ messsage: 'photo is required and must be image file' });
    }

    if (!req.isFileValid) {
      return res.status(400).json({ messsage: isFileValidMessage });
    }

    if (!name || !email || !password || !phone_number) {
      return res.status(400).json({
        code: 400,
        message: 'name, email, password, phone_number and is required!',
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

    const imageUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: 'users_recipes',
    });

    if (!imageUpload) {
      return res.status(400).json({ messsage: 'upload photo failed' });
    }

    //   hash password
    let passwordHashed = await bcrypt.hash(password, 10);
    let data = { name, email, passwordHashed, phone_number, photo: imageUpload.secure_url, uuid: uuidv4() };
    await createUser(data);

    if (!data) {
      return res.status(404).json({
        code: 404,
        message: 'Register Failed!',
      });
    }

    // Activation Email
    let user = await getUserByEmail(data.email);
    let sendEmailToUser = await sendMail(user.rows[0].email, user.rows[0].uuid);

    if (!sendEmailToUser) {
      await createUser.rollback();
      return res.status(500).json({
        code: 500,
        error: 'Send email failed',
        message: 'Register Failed',
      });
    }

    res.status(200).json({
      code: 200,
      message: 'Register success, please check your email to activate!',
    });
  },

  setActivateUser: async (req, res, next) => {
    let id_user = req.params.id;
    let checkUser = await checkUserIsActive(id_user);

    if (!checkUser) {
      return res.status(404).json({
        code: 404,
        message: 'User not found or user has been activated!',
      });
    }

    await activateUser(checkUser.rows[0].uuid);

    res.status(200).json({
      code: 200,
      message: 'User activated successfully',
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

    // Check email is activated?
    if (checkEmail.rows[0].is_active === false) {
      return res.status(400).json({
        code: 400,
        message: 'Email not active, please check your email to activated',
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
