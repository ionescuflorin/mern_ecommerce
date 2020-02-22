const express = require('express');
// 1. use express router
const router = express.Router();
// 4. import controllers
const { create, productById, read, remove } = require('../controllers/product');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');

// 2. create a route and use the logic from controllers
router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

router.param('userId', userById);
router.param('productId', productById);

// 3. export router
module.exports = router;
