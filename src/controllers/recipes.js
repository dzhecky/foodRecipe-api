const { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipeById } = require('../models/recipes');

const recipesController = {
  allRecipes: async (req, res, next) => {
    let recipes = await getAllRecipes();
    let data = recipes.rows;

    if (!data) {
      return res.status(404).json({
        code: 400,
        message: 'Failed get data!',
      });
    }
    res.status(200).json({
      code: 200,
      message: 'Success get data!',
      data,
    });
  },

  getRecipeId: async (req, res) => {
    let id_recipe = req.params.id;

    let data = await getRecipeById(id_recipe);
    let result = data.rows[0];

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: 'Failed get data!',
      });
    }
    res.status(200).json({
      code: 200,
      message: 'Success get data!',
      result,
    });
  },

  inputRecipe: async (req, res) => {
    let { photo, title, ingredients, id_user, id_category } = req.body;

    if (!photo || !title || !ingredients || !id_user || !id_category) {
      return res.status(400).json({
        code: 400,
        message: 'photo, title, ingredients, id user and id category is required',
      });
    }

    let data = { photo, title, ingredients, id_user, id_category };
    let result = await createRecipe(data);

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
    let { photo, title, ingredients, id_user, id_category } = req.body;

    let recipe_data = await getRecipeById(id_recipe);

    if (recipe_data.rowCount == 0) {
      return res.status(404).json({
        code: 404,
        message: 'Failed data not found!',
      });
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
      newData,
    });
  },

  deleteRecipeId: async (req, res) => {
    let id_recipe = req.params.id;

    let data = await getRecipeById(id_recipe);
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
};

module.exports = recipesController;
