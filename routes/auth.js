const express = require("express");
// 1. use express router
const router = express.Router();
// 4. import controllers
const { signup, signin, signout, requireSignin } = require("../controllers/auth");
// 5. adding a validator
const {userSignupValidator} = require('../validator')

// 2. create a route and use the logic from controllers
router.post("/signup", userSignupValidator ,signup);
router.post("/signin", signin);
router.get("/signout", signout);

// 3. export router
module.exports = router;
   