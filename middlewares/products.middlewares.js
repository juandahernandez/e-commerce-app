// models
const { Product } = require('../models/product.model');

// utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.productExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { productId } = req.body;

  const product = await Product.findOne({
    where: { id, status: 'active' || productId }
  });

  if (!product) {
    return next(new AppError(404, 'Product not found given that id'));
  }

  req.product = product;
  next();
});

exports.productOwner = catchAsync(async (req, res, next) => {
  const { sessionUser, product } = req;

  if (product.userId !== sessionUser.id) {
    return next(new AppError(403, 'You are not the owner of this product'));
  }

  next();
});
