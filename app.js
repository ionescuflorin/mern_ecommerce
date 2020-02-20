// 1. import express
const express = require("express");
// 9. import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
// 10. import morgan for logging data in console
const morgan = require('morgan')
// 11. import body parser
const bodyParser = require('body-parser')
// 13. import cookie parser - we save user credentials in a cookie
const cookieParser = require('cookie-parser')
// 14. import express validator
const expressValidator = require('express-validator')

// 7. import mongoose
const mongoose = require("mongoose");
// 3. allowing to use .env varialbes
require("dotenv").config();
// 2. instantiate express in order to have an express app
const app = express();

// 8. db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

// 12. using middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator());

// 4. routes middleware from routes folder
app.use('/api', authRoutes);
app.use('/api', userRoutes);


// 5. which port we want to run our server
const port = process.env.PORT || 8000;

// 6. run the app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
