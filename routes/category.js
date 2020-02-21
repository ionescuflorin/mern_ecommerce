const express = require("express");
// 1. use express router
const router = express.Router();
// 4. import controllers
const { create } = require("../controllers/category");

// 2. create a route and use the logic from controllers
router.post("/category/create", create);

// 3. export router
module.exports = router;
