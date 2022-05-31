const express = require('express');

//Middlewares
const {
  productExist,
  productOwner
} = require('../middlewares/products.middlewares');

const {
  userExists,
  protectToken
} = require('../middlewares/users.middlewares');

const {
  createProductValidations,
  checkValidations
} = require('../middlewares/validations.middlewares');

//controllers
const {
  createProduct,
  getAllproducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/products.controller');

const router = express.Router();

router.get('/', getAllproducts);

router.get('/:id', productExist, getProductById);

router.use(protectToken);

router.post('/', createProductValidations, checkValidations, createProduct);

router
  .route('/:id')
  .patch(productExist, productOwner, updateProduct)
  .delete(productExist, productOwner, deleteProduct);

module.exports = { productsRouter: router };
