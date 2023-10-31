const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { showAllUsers, countAll, showUserById, deleteUserById, updateUserById } = require('../models/users');
const createPagination = require('../utils/createPagination');

const usersController = {
  getAllUsers: async (req, res) => {
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';
    let sort = req.query.sort;
    let count = await countAll(search);
    let paging = createPagination(count.rows[0].count, page, limit);

    let users = await showAllUsers(paging, search, sort);

    if (users.rows == 0) {
      return res.status(404).json({
        code: 404,
        message: 'Failed get data!',
      });
    }

    res.status(200).json({
      code: 200,
      message: 'Success get data!',
      data: users.rows,
      pagination: paging.response,
    });
  },

  getUsersById: async (req, res) => {
    let id_user = req.params.id;

    let data = await showUserById(id_user);
    let result = data.rows[0];

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: 'Data not found!',
      });
    }
    res.status(200).json({
      code: 200,
      message: 'Success get data!',
      result,
    });
  },

  // register: async (req, res) => {
  //   let { name, email, password, phone_number, photo } = req.body;

  //   if (!name || !email || !password || !phone_number || !photo) {
  //     return res.status(400).json({
  //       code: 400,
  //       message: 'name, email, password, phone_number and photo is required!',
  //     });
  //   }

  //   let checkEmail = await checkEmailRegistered(email);
  //   let checkEmailResult = checkEmail.rows[0].count;

  //   if (checkEmailResult > 0) {
  //     return res.status(400).json({
  //       code: 400,
  //       message: 'Email has been registered!',
  //     });
  //   }

  //   //   hash password
  //   let passwordHashed = await bcrypt.hash(password, 10);
  //   let data = { name, email, passwordHashed, phone_number, photo };
  //   await createUser(data);

  //   if (!data) {
  //     return res.status(404).json({
  //       code: 404,
  //       message: 'Register Failed!',
  //     });
  //   }

  //   res.status(200).json({
  //     code: 200,
  //     message: 'Register success!',
  //   });
  // },

  // login: async (req, res) => {
  //   let { email, password } = req.body;

  //   if (!email || !password) {
  //     return res.status(400).json({
  //       code: 400,
  //       message: 'email and password is required!',
  //     });
  //   }

  //   //   Check email is registered?
  //   let checkEmail = await getUserByEmail(email);
  //   if (checkEmail.rows.length === 0) {
  //     return res.status(400).json({
  //       status: false,
  //       message: 'Email not registered',
  //     });
  //   }

  //   //   Check password is match?
  //   let isMatch = bcrypt.compareSync(password, checkEmail.rows[0].password);
  //   if (!isMatch) {
  //     return res.status(400).json({
  //       code: 400,
  //       message: 'Incorrect password, please enter the correct password',
  //     });
  //   }

  //   // Generate token
  //   const token = jwt.sign(checkEmail.rows[0], process.env.JWT_SECRET);
  //   res.status(200).json({
  //     code: 200,
  //     message: 'Login success!',
  //     token,
  //   });
  // },

  deleteUser: async (req, res) => {
    let id_user = req.params.id;

    let data = await showUserById(id_user);
    let result = data.rows[0];

    console.log(result);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: 'Failed data not found!',
      });
    }

    await deleteUserById(id_user);
    res.status(200).json({
      code: 200,
      message: 'Success delete data!',
    });
  },

  updateUser: async (req, res) => {
    let id_user = req.user.id_user;
    let { name, email, password, phone_number, photo } = req.body;

    //   Check user
    let user = await showUserById(id_user);

    if (user.rowCount == 0) {
      return res.status(404).json({
        code: 404,
        message: 'Failed, data not found!',
      });
    }

    let data = user.rows[0];
    password = password || data.password;
    let passwordHashed = await bcrypt.hash(password, 10);

    let newData = {
      id_user: data.id_user,
      name: name || data.name,
      email: email || data.email,
      passwordHashed,
      phone_number: phone_number || data.phone_number,
      photo: photo || data.photo,
    };

    let result = await updateUserById(newData);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: 'Failed update data!',
      });
    }

    res.status(200).json({
      code: 200,
      message: 'Success update data!',
    });
  },
};

module.exports = usersController;
