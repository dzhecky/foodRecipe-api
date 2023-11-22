const Pool = require('../config/db');

const selectAllRecipes = async (paging, keyword, searchBy = 'title', sort = 'updated_time') => {
  return new Promise((resolve, reject) => {
    let query = `SELECT recipes.id_recipe, recipes.title, recipes.ingredients, recipes.photo, recipes.created_time, recipes.updated_time, users.uuid, users.name AS author, users.photo AS photo_author, category.name AS category, category.id_category FROM recipes JOIN users ON recipes.id_user=users.id_user JOIN category ON recipes.id_category=category.id_category WHERE`;

    if (searchBy.trim() === 'ingredients') {
      query += ` LOWER(ingredients) LIKE'%${keyword}%'`;
    } else {
      query += ` LOWER(${searchBy}) LIKE'%${keyword}%'`;
    }

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

const selectRecipeById = async (id_recipe) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT recipes.id_recipe, recipes.title, recipes.ingredients, recipes.photo, recipes.created_time, recipes.updated_time, users.uuid AS uuid_author, users.name AS author, users.photo AS photo_author, category.name AS category, recipes.id_category FROM recipes JOIN users ON recipes.id_user=users.id_user JOIN category ON recipes.id_category=category.id_category WHERE recipes.id_recipe=${id_recipe}`,
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

const getIdOwnerRecipe = async (id_recipe) => {
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

const inputRecipe = async (data) => {
  const { photo, title, ingredients, id_user, id_category, uuid } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`INSERT INTO recipes (photo, title, ingredients, id_user, id_category, uuid) VALUES ('${photo}', '${title}', '${ingredients}', ${id_user}, ${id_category}, '${uuid}')`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
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

const getRecipeByIdUser = (uuid, paging, search, sort = 'updated_time') => {
  return new Promise((resolve, reject) => {
    let query = `SELECT recipes.id_recipe, recipes.title, recipes.ingredients, recipes.photo, recipes.created_time, recipes.updated_time, users.name AS author, category.name AS category, category.id_category FROM recipes JOIN users ON recipes.id_user=users.id_user JOIN category ON recipes.id_category=category.id_category WHERE users.uuid='${uuid}' AND LOWER(title) LIKE'%${search}%'`;

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
        return reject(err);
      }
    });
  });
};

const countAll = async (keyword, searchBy = 'title') => {
  return new Promise((resolve, reject) => {
    let query = `SELECT COUNT(*) FROM recipes WHERE`;

    if (searchBy.trim() === 'ingredients') {
      query += ` LOWER(ingredients) LIKE'%${keyword}%'`;
    } else {
      query += ` LOWER(${searchBy}) LIKE'%${keyword}%'`;
    }

    Pool.query(query, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const countMyRecipe = async (uuid, search) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM recipes WHERE uuid='${uuid}' AND LOWER(title) LIKE'%${search}%'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const countRecipes = async (uuid) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM recipes WHERE uuid='${uuid}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = {
  selectAllRecipes,
  selectRecipeById,
  inputRecipe,
  updateRecipe,
  deleteRecipeById,
  countAll,
  getRecipeByIdUser,
  countMyRecipe,
  getIdOwnerRecipe,
  countRecipes,
};
