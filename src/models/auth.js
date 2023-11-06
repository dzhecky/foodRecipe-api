const Pool = require('../config/db');

const createUser = async (data) => {
  const { name, email, passwordHashed, phone_number, photo, uuid } = data;
  return new Promise((resolve, reject) => {
    Pool.query(
      `INSERT INTO users (name, email, password, phone_number, photo, created_time, updated_time, uuid) VALUES ('${name}', '${email}', '${passwordHashed}', '${phone_number}', '${photo}', current_timestamp, current_timestamp, '${uuid}')`,
      (err, result) => {
        if (!err) {
          return resolve(result);
        } else {
          return reject(err);
        }
      }
    );
  });
};

const checkEmailRegistered = async (email) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM users WHERE email='${email}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = { createUser, checkEmailRegistered };
