// models

const { Cart } = require('../models/cart.model');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart.model');
const { User } = require('../models/user.model');

const initModels = () => {
  User.hasMany(Product);
  Product.belongsTo(User);

  User.hasMany(Order);
  Order.belongsTo(User);

  User.hasOne(Cart);
  Cart.belongsTo(User);

  Cart.hasOne(Order);
  Order.belongsTo(Cart);

  Cart.hasMany(ProductInCart);
  ProductInCart.belongsTo(Cart);

  Product.hasOne(ProductInCart);
  ProductInCart.belongsTo(Product);
};

module.exports = { initModels };
