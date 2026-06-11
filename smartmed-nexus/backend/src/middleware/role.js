const { AppError } = require('./errorHandler');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Role '${req.user.role}' is not authorized to access this resource`, 403)
      );
    }
    next();
  };
};

module.exports = authorize;
