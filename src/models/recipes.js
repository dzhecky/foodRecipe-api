const Pool = require('../config/db');

const getAllRecipes = async (paging, search, sort = 'created_time') => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM recipes WHERE LOWER(title) LIKE'%${search}%'`;

    if (sort.trim() === 'title') {
      query += ` ORDER BY title`;
    } else {
      query += ` ORDER BY ${sort} DESC`;
    }

    query += ` LIMIT ${paging.limit} OFFSET ${paging.offset}`;

    Pool.query(query, (err, result) => {
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
  const { photo, title, ingredients, id_user, id_category } = data;
  return new Promise((resolve, reject) => {
    Pool.query(
      `INSERT INTO recipes (photo, title, ingredients, created_time, updated_time, id_user, id_category) VALUES ('${photo}', '${title}', '${ingredients}', current_timestamp, current_timestamp, ${id_user}, ${id_category})`,
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

const updateRecipe = async (data) => {
  const { id_recipe, photo, title, ingredients, id_category } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`UPDATE recipes SET photo='${photo}', title='${title}', ingredients='${ingredients}', updated_time=current_timestamp, id_category=${id_category} WHERE id_recipe=${id_recipe}`, (err, result) => {
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

const getRecipeByIdUser = (id_user, paging, sort = 'created_time') => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM recipes WHERE id_user=${id_user} ORDER BY ${sort} DESC LIMIT ${paging.limit} OFFSET ${paging.offset}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const countAll = async (search) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM recipes WHERE LOWER(title) LIKE'%${search}%'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const countMyRecipe = async (id_user) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM recipes WHERE id_user=${id_user}`, (err, result) => {
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
  countAll,
  getRecipeByIdUser,
  countMyRecipe,
};
