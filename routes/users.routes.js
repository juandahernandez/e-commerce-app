const express = require('express');

// Middlewares
const {
  userExists,
  protectToken,
  protectAccountOwner
} = require('../middlewares/users.middlewares');

// Controller
const {
  createUser,
  loginUser,
  getAllProducts,
  updateUser,
  deleteUser,
  getAllOrders,
  getOrderById
} = require('../controllers/users.controller');

const router = express.Router();

router.post('/', createUser);

router.post('/login', loginUser);

router.use(protectToken);

router.get('/me', getAllProducts);

router.get('/orders', getAllOrders);

router.get('/orders/:id', userExists, getOrderById);

router
  .route('/:id')
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
