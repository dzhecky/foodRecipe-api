const { getIdOwnerRecipe } = require('../models/recipes');

module.exports = {
  onlyAdmin: (req, res, next) => {
    if (req.user.level === 1) {
      // console.log('cek only admin lolos');
      return next();
    }
    return res.status(403).json({
      code: 403,
      message: 'Forbidden access',
      level: req.user.level,
    });
  },

  onlyUsers: (req, res, next) => {
    if (req.user.level === 2) {
      // console.log('cek only users lolos');
      return next();
    }
    // console.log('cek only users tidak lolos');
    return res.status(403).json({
      code: 403,
      message: 'Forbidden access',
    });
  },

  usersAndAdmin: (req, res, next) => {
    if (req.user.level === 1 || req.user.level === 2) {
      // console.log('cek only users lolos');
      return next();
    }
    // console.log('cek only users tidak lolos');
    return res.status(403).json({
      code: 403,
      message: 'Forbidden access',
    });
  },

  mySelf: (req, res, next) => {
    let idUser = req.user.uuid;
    let myId = req.params.id;

    if (idUser == myId) {
      return next();
    }
    return res.status(403).json({
      code: 403,
      message: 'Forbidden access',
    });
  },

  recipeOwner: async (req, res, next) => {
    let idUser = req.user.id_user;
    let idRecipe = req.params.id;
    let recipe = await getIdOwnerRecipe(idRecipe);

    if (!recipe.rowCount) {
      next();
    } else {
      if (idUser === recipe.rows[0].id_user) {
        next();
      } else {
        res.status(403).json({
          code: 403,
          message: 'Forbidden access',
        });
      }
    }
  },
};
