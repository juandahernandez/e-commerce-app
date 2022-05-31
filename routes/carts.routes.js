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
const { cartExists } = require('../middlewares/cart.middlewares');

const router = express.Router();

router.use(protectToken);

router.post('/add-product', addProductToCart);

router.patch('/update-cart', cartExists, productExist, updateProductInCart);

router.post('/purchase', cartExists, purchaseCart);

router.delete('/:productId', cartExists, removeProductFromCart);
