const express = require("express");
// 1. use express router
const router = express.Router();
// 4. import controllers
const { create, categoryById, read } = require("../controllers/category");
const { requireSignin, isAdmin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// 2. create a route and use the logic from controllers
router.get('/category/:categoryId', read)
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);

router.param('categoryId', categoryById)
router.param("userId", userById);

// 3. export router
module.exports = router;
