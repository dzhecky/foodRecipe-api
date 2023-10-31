const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    return res.status(400).json({
      code: 400,
      message: 'Access Denied!',
    });
  }

  try {
    let verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      message: 'Invalid Token',
    });
  }
};

module.exports = verifyToken;
