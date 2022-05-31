const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError');

exports.createUserValidations = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

exports.createProductValidations = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title cannot be empty'),
  body('description')
    .isString()
    .withMessage('Description must be a string')
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be greater than 0'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .isInt({ min: 1 })
    .withMessage('Quantity must be greater than 0')
  // body('categoryId')
  //   .isInt({ min: 1 })
  //   .withMessage('Must provide a valid category'),
];

exports.checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    const errorMsg = messages.join('. ');

    return next(new AppError(400, errorMsg));
  }

  next();
};
