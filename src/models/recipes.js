const Pool = require('../config/db');

const getAllRecipes = async () => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM recipes`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        reject(err);
      }
    });
  });
};

const getRecipeById = async (id_recipe) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM recipes WHERE id_recipe=${id_recipe}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const createRecipe = async (data) => {
  const { photo, title, ingredients, id_user } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`INSERT INTO recipes (photo, title, ingredients, created_time, updated_time, id_user) VALUES ('${photo}', '${title}', '${ingredients}', current_timestamp, current_timestamp, ${id_user})`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const updateRecipe = async (data) => {
  const { id_recipe, photo, title, ingredients } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`UPDATE recipes SET photo='${photo}', title='${title}', ingredients='${ingredients}', updated_time=current_timestamp WHERE id_recipe=${id_recipe}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteRecipeById = async (id_recipe) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM recipes WHERE id_recipe=${id_recipe}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipeById,
};
