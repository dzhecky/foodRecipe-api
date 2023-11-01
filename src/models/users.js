const Pool = require('../config/db');

const countAll = async (search) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM users WHERE LOWER(name) LIKE'%${search}%'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const showAllUsers = async (paging, search, sort = 'name') => {
  return new Promise((resolve, reject) => {
    let query = `SELECT id_user, name, email, phone_number, photo, created_time FROM users WHERE LOWER(name) LIKE'%${search}%'`;
    if (sort === 'created_time') {
      query += ` ORDER BY created_time DESC`;
    } else {
      query += ` ORDER BY ${sort}`;
    }
    query += ` LIMIT ${paging.limit} OFFSET ${paging.offset}`;
    Pool.query(query, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const showUserById = async (id_user) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT id_user, name, email, phone_number, photo, created_time FROM users WHERE id_user=${id_user}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteUserById = async (id_user) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM users WHERE id_user=${id_user}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const updateUserById = async (data) => {
  const { id_user, name, email, passwordHashed, phone_number, photo } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`UPDATE users SET name='${name}', email='${email}', password='${passwordHashed}', phone_number='${phone_number}', photo='${photo}', updated_time=current_timestamp WHERE id_user=${id_user}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = {
  showAllUsers,
  countAll,
  showUserById,
  deleteUserById,
  updateUserById,
};
