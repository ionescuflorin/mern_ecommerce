// import models
const User = require('../models/user')

exports.signup = (req, res) => {
    // create new user based on what we get from the request body
    // console.log('req.body', req.body);
    const user = new User(req.body)
   user.save((err, user) => {
       if(err) {
           return res.status(400).json({
               err
           })
       }
       res.json({
           user
       })
   })
}