const bcrypt = require('bcrypt');
const { showAllUsers, countAll, showUserById, deleteUserById, updateUserById } = require('../models/users');
const createPagination = require('../utils/createPagination');

const usersController = {
  getAllUsers: async (req, res) => {
    // pagination
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
        message: 'Failed get data, data not found!',
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
        message: 'Failed, data not found!',
        data: [],
      });
    }
    res.status(200).json({
      code: 200,
      message: 'Success get data!',
      result,
    });
  },

  deleteUser: async (req, res) => {
    let id_user = req.params.id;

    let data = await showUserById(id_user);
    let result = data.rows[0];

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
    let id_user = req.params.id;
    let { name, email, password, phone_number, photo } = req.body;

    if (!password) {
      return res.status(400).json({
        code: 400,
        message: 'password is required!',
      });
    }

    console.log(id_user);
    //   Check user
    let user = await showUserById(id_user);
    console.log(user);

    if (user.rowCount == 0) {
      return res.status(404).json({
        code: 404,
        message: 'Failed, data not found!',
        data: [],
      });
    }

    // hashing password with bcrypt
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
      uuid: data.uuid,
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
