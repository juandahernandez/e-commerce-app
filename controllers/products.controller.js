// models
const { Product } = require('../models/product.model');

// Utils
const { filterObj } = require('../utils/filterObj');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.createProduct = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { title, description, price, quantity } = req.body;

  if (!title || !description || !price || !quantity) {
    return next(new AppError(400, 'insert valid data'));
  }

  const newProduct = await Product.create({
    title,
    description,
    price,
    quantity,
    userId: sessionUser.userId
  });

  res.status(201).json({
    status: 'succes',
    data: { newProduct }
  });
});

exports.getAllproducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: 'active' }
  });

  res.status(200).json({
    status: 'success',
    data: { products }
  });
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  const data = filterObj(req.body, 'title', 'description', 'price', 'quantity');

  await product.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
