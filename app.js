// 1. import express
const express = require("express");
// 2. instantiate express in order to have an express app
const app = express();
// 9. import routes
const userRoutes = require('./routes/user')
// 7. import mongoose
const mongoose = require("mongoose");
// 3. allowing to use .env varialbes
require("dotenv").config();

// 8. db connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

// 4. routes middleware from routes folder
app.use('/api',userRoutes)

// 5. which port we want to run our server
const port = process.env.PORT || 8000;

// 6. run the app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
