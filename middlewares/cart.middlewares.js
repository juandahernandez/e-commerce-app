// Models
const { Cart } = require('../models/cart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.cartExists = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  // Find user's cart
  const cart = await Cart.findOne({
    where: { status: 'active', userId: sessionUser.id }
  });

  if (!cart) {
    return next(new AppError(400, 'This user does not have a cart yet'));
  }

  req.cart = cart;

  next();
});
