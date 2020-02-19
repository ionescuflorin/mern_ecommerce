// 1. import express
const express = require('express')
// 2. instantiate express in order to have an express app
const app = express()
// 3. allowing to use .env varialbes
require('dotenv').config()

// 4. handling requests for '/'
app.get('/', (req, res) => {
    res.send('Hello')
})

// 5. which port we want to run our server
const port = process.env.PORT || 8000

// 6. run the app
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})