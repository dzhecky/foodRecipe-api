const { getAllCategory, getCategoryById } = require('../models/category');

const categoryController = {
  allCategory: async (req, res) => {
    let data = await getAllCategory();
    let result = data.rows;

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

  getCategoryId: async (req, res) => {
    let id_category = req.params.id;
    let data = await getCategoryById(id_category);

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
};

module.exports = categoryController;
