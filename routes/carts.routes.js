const express = require('express');

// controllers
const {
  addProductToCart,
  updateProductInCart,
  purchaseCart,
  removeProductFromCart
} = require('../controllers/carts.controller');

// middlewares
const { productExist } = require('../middlewares/products.middlewares');
//const { cartExists } = require('../middlewares/cart.middlewares');
const { protectToken } = require('../middlewares/users.middlewares');

const router = express.Router();

router.use(protectToken);

router.post('/add-product', addProductToCart);

router.patch('/update-cart', productExist, updateProductInCart);

router.post('/purchase', purchaseCart);

router.delete('/:productId', removeProductFromCart);

module.exports = { cartsRouter: router };
