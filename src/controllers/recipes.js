const { getAllCategory } = require('../models/category');
const { selectAllRecipes, selectRecipeById, inputRecipe, updateRecipe, deleteRecipeById, countAll, getRecipeByIdUser, countMyRecipe } = require('../models/recipes');
const createPagination = require('../utils/createPagination');

const recipesController = {
  allRecipes: async (req, res) => {
    // Pagination
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';
    let sort = req.query.sort;
    let count = await countAll(search);
    let paging = createPagination(count.rows[0].count, page, limit);

    // check sort
    let lisSort = ['title', 'updated_time', 'category', undefined];
    if (!lisSort.includes(sort)) {
      return res.status(404).json({ messsage: 'Sort invalid' });
    }

    let recipes = await selectAllRecipes(paging, search, sort);
    let data = recipes.rows;

    if (data.length == 0) {
      return res.status(404).json({
        code: 400,
        message: 'Failed, data not found!',
      });
    }

    // change items ingredients with split
    data.forEach((items, i) => {
      let ingredients = items.ingredients.split(',');
      data[i].ingredients = ingredients;
    });

    res.status(200).json({
      code: 200,
      message: 'Success get data!',
      data,
      pagination: paging.response,
    });
  },

  getRecipeById: async (req, res) => {
    let id_recipe = req.params.id;

    let recipe = await selectRecipeById(id_recipe);
    let data = recipe.rows[0];

    if (!data) {
      return res.status(404).json({
        code: 404,
        message: 'Failed, data not found!',
      });
    }

    // change items ingredients with split
    let { title, ingredients, photo, author, created_time, updated_time, category } = data;
    ingredients = data.ingredients.split(',');
    let result = { title, ingredients, photo, author, created_time, updated_time, category };

    res.status(200).json({
      code: 200,
      message: 'Success get data!',
      data: result,
    });
  },

  postRecipe: async (req, res) => {
    let { photo, title, ingredients, id_category } = req.body;
    let id_user = req.user.id_user;

    if (!photo || !title || !ingredients || !id_user || !id_category) {
      return res.status(400).json({
        code: 400,
        message: 'photo, title, ingredients, id user and id category is required',
      });
    }

    // check category
    let category = await getAllCategory();
    let is_category = false;
    category.rows.forEach((items) => {
      if (items.id_category == id_category) return (is_category = true);
    });

    if (!is_category) {
      return res.status(404).json({ messsage: 'category invalid' });
    }

    let data = { photo, title, ingredients, id_user, id_category };
    let result = await inputRecipe(data);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: 'Failed input data!',
      });
    }

    res.status(200).json({
      code: 200,
      message: 'Success input data!',
      data,
    });
  },

  putRecipe: async (req, res) => {
    let id_recipe = req.params.id;
    let id_user = req.user.id_user;
    let { photo, title, ingredients, id_category } = req.body;

    let recipe_data = await selectRecipeById(id_recipe);

    if (recipe_data.rowCount == 0) {
      return res.status(404).json({
        code: 404,
        message: 'Failed data not found!',
      });
    }

    // check category
    let category = await getAllCategory();
    let is_category = false;
    category.rows.forEach((items) => {
      if (items.id_category == id_category) return (is_category = true);
    });

    if (!is_category) {
      return res.status(404).json({ messsage: 'category invalid' });
    }

    let data = recipe_data.rows[0];

    let newData = {
      id_recipe: data.id_recipe,
      photo: photo || data.photo,
      title: title || data.title,
      ingredients: ingredients || data.ingredients,
      id_user: id_user || data.id_user,
      id_category: id_category || data.id_category,
    };
    let result = await updateRecipe(newData);

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

  deleteRecipeId: async (req, res) => {
    let id_recipe = req.params.id;

    let data = await selectRecipeById(id_recipe);
    let result = data.rows[0];

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: 'Failed data not found!',
      });
    }

    await deleteRecipeById(id_recipe);
    res.status(200).json({
      code: 200,
      message: 'Success delete data!',
    });
  },

  myRecipes: async (req, res) => {
    // pagination
    let id_user = req.user.id_user;
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';
    let sort = req.query.sort;
    let count = await countMyRecipe(id_user, search);
    let paging = createPagination(count.rows[0].count, page, limit);

    // check sort
    let lisSort = ['title', 'updated_time', 'category', undefined];
    if (!lisSort.includes(sort)) {
      return res.status(404).json({ messsage: 'Sort invalid' });
    }

    let recipes = await getRecipeByIdUser(id_user, paging, search, sort);
    let data = recipes.rows;

    if (data.length == 0) {
      return res.status(404).json({
        code: 404,
        message: 'Failed, data not found!',
      });
    }

    // change items ingredients with split
    data.forEach((items, i) => {
      let ingredients = items.ingredients.split(',');
      data[i].ingredients = ingredients;
    });

    res.status(200).json({
      code: 200,
      message: 'Success get data!',
      data: data,
      pagination: paging.response,
    });
  },
};

module.exports = recipesController;
