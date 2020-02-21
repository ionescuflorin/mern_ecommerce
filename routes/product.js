const express = require("express");
// 1. use express router
const router = express.Router();
// 4. import controllers
const { create } = require("../controllers/product");
const { requireSignin, isAdmin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// 2. create a route and use the logic from controllers
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);

router.param("userId", userById);

// 3. export router
module.exports = router;
