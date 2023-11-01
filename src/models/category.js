const Pool = require('../config/db');

const getAllCategory = async () => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM category ORDER BY id_category`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const getCategoryById = async (id_category) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM category WHERE id_category=${id_category}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = { getAllCategory, getCategoryById };
