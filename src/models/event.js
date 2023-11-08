const Pool = require('../config/db');

const insertEvent = async (data) => {
  const { recipes_id, users_id, status } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`INSERT INTO event (recipes_id, users_id, status) VALUES (${recipes_id}, '${users_id}', '${status}')`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectAllEvent = async () => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectEventByIdRecipe = async (recipes_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event WHERE recipes_id=${recipes_id}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteBookmarkByIdRecipe = async (recipes_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM event WHERE recipes_id=${recipes_id} AND status='bookmark'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteLikeByIdRecipe = async (recipes_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM event WHERE recipes_id=${recipes_id} AND status='like'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectMyBookmark = async (users_id, paging) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT recipes.id_recipe, recipes.photo, recipes.title, recipes.ingredients, users.name AS author, category.name AS category, event.status FROM event JOIN recipes ON event.recipes_id = recipes.id_recipe JOIN users ON recipes.uuid = users.uuid JOIN category ON recipes.id_category = category.id_category WHERE event.users_id='${users_id}' AND event.status='bookmark' ORDER BY created_at DESC LIMIT ${paging.limit} OFFSET ${paging.offset}`,
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

const selectMyLike = async (users_id, paging) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT recipes.id_recipe, recipes.photo, recipes.title, recipes.ingredients, users.name AS author, category.name AS category, event.status FROM event JOIN recipes ON event.recipes_id = recipes.id_recipe JOIN users ON recipes.uuid = users.uuid JOIN category ON recipes.id_category = category.id_category WHERE event.users_id='${users_id}' AND event.status='like' ORDER BY created_at DESC LIMIT ${paging.limit} OFFSET ${paging.offset}`,
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

const countMyBookmark = async (users_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM event WHERE users_id='${users_id}' AND status='bookmark'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const countMyLike = async (users_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM event WHERE users_id='${users_id}' AND status='like'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const checkIsBookmark = async (recipes_id, users_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event WHERE recipes_id='${recipes_id}' AND status='bookmark' AND users_id='${users_id}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const checkIsLike = async (recipes_id, users_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event WHERE recipes_id='${recipes_id}' AND status='like' AND users_id='${users_id}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const getIdOwnerEvent = async (recipes_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event WHERE recipes_id=${recipes_id}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = { insertEvent, selectAllEvent, selectEventByIdRecipe, deleteBookmarkByIdRecipe, selectMyBookmark, selectMyLike, countMyBookmark, countMyLike, deleteLikeByIdRecipe, checkIsBookmark, checkIsLike, getIdOwnerEvent };