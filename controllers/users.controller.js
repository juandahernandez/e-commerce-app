const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');

// Utils
const { filterObj } = require('../utils/filterObj');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError(400, 'insert valid data'));
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'succes',
    data: { newUser }
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(400, 'Credentials are invalid'));
  }
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { token, user }
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const products = await Product.findAll({
    where: { userId: sessionUser.id }
  });

  res.status(200).json({
    status: 'success',
    data: { products }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const data = filterObj(req.body, 'name', 'email');

  await user.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: { userId: sessionUser.id },
    include: [{ model: Cart, include: [{ model: ProductInCart }] }]
  });

  res.status(200).json({
    status: 'success',
    data: { orders }
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Order.findOne({
    where: { id, userId: sessionUser.id },
    include: [{ model: Cart, include: [{ model: ProductInCart }] }]
  });

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});
