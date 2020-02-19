const express = require("express");
// 1. use express router
const router = express.Router();
// 4. import controllers
const { sayHi } = require("../controllers/user.js");

// 2. create a route and use the logic from controllers
router.get("/", sayHi);

// 3. export router
module.exports = router;
