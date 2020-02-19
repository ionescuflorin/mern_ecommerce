const express = require('express')
// 1. use express router
const router = express.Router()

// 2. create a route
router.get('/', (req, res) => {
    res.send('hello from node')
})


// 3. export router
module.exports = router