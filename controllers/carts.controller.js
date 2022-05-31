// models
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Order } = require('../models/order.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId, quantity } = req.body;

  // Check if product to add, does not exceeds that requested amount
  const product = await Product.findOne({
    where: { status: 'active', id: productId }
  });

  if (quantity > product.quantity) {
    return next(
      new AppError(400, `This product only has ${product.quantity} items.`)
    );
  }

  // Check if user's cart is active, if not, create one
  const cart = await Cart.findOne({
    where: { status: 'active', userId: sessionUser.id }
  });

  if (!cart) {
    // Create a new cart
    const newCart = await Cart.create({ userId: sessionUser.id });

    await ProductInCart.create({
      productId,
      cartId: newCart.id,
      quantity
    });
  } else {
    // Cart already exists
    // Check if product is already in the cart
    const productExists = await ProductInCart.findOne({
      where: { cartId: cart.id, productId }
    });

    if (productExists && productExists.status === 'active') {
      return next(new AppError(400, 'This product is already in the cart'));
    }

    // If product is in the cart but was removed before, add it again
    if (productExists && productExists.status === 'removed') {
      await productExists.update({ status: 'active', quantity });
    }

    // Add new product to cart
    if (!productExists) {
      await ProductInCart.create({
        cartId: cart.id,
        productId,
        quantity
      });
    }
  }

  res.status(201).json({ status: 'success' });
});

exports.updateProductInCart = catchAsync(async (req, res, next) => {
  const { cart, product } = req;
  const { productId, quantity } = req.body;

  // Check if quantity exceeds available amount
  if (quantity > product.quantity) {
    return next(
      new AppError(400, `This product only has ${product.quantity} items`)
    );
  }

  // Find the product in cart requested
  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId }
  });

  if (!productInCart) {
    return next(
      new AppError(404, `Can't update product, is not in the cart yet`)
    );
  }

  // If qty is 0, mark the product's status as removed
  if (quantity === 0) {
    await productInCart.update({ quantity: 0, status: 'removed' });
  }

  // Update product to new qty
  if (quantity > 0) {
    await productInCart.update({ quantity });
  }

  res.status(204).json({ status: 'success' });
});

exports.purchaseCart = catchAsync(async (req, res, next) => {
  const { sessionUser, cart } = req;

  let totalPrice = 0;

  // Update all products as purchased
  const cartPromises = cart.products.map(async (product) => {
    await product.productInCart.update({ status: 'purchased' });

    // Get total price of the order
    const productPrice = product.price * product.productInCart.quantity;

    totalPrice += productPrice;

    // Discount the quantity from the product
    const newQty = product.quantity - product.productInCart.quantity;

    return await product.update({ quantity: newQty });
  });

  await Promise.all(cartPromises);

  // Mark cart as purchased
  await cart.update({ status: 'purchased' });

  const newOrder = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    // issuedAt: new Date().toLocaleString(),
    totalPrice
  });

  res.status(201).json({
    status: 'success',
    data: { newOrder }
  });
});

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const { cart } = req;
  const { productId } = req.params;

  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId }
  });

  if (!productInCart) {
    return next(new AppError(404, 'This product does not exist in this cart'));
  }

  await productInCart.update({ status: 'removed', quantity: 0 });

  res.status(204).json({ status: 'success' });
});
