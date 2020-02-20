// import models
const User = require('../models/user')
// generate signed token
const jwt = require('jsonwebtoken')
// for authorization check
const expressJwt = require('express-jwt')
const {errorHandler} = require('../helpers/dbErrorHandler')

const dotenv = require("dotenv");
dotenv.config();

exports.signup = (req, res) => {
    // create new user based on what we get from the request body
    // console.log('req.body', req.body);
    const user = new User(req.body)
   user.save((err, user) => {
       if(err) {
           return res.status(400).json({
               err: errorHandler(err)
           })
       }
       user.salt = undefined
       user.hashed_password = undefined
       res.json({
           user
       })
   })
}

exports.signin = (req, res) => {
    // find a user based on email
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
       if(err || !user) {
           return res.status(400).json({
               error: 'User with that email does not exists. Please sign up'
           })
       } 
       // if user is found make sure the email and password match
       // create authenticate method in user model
       if(!user.authenticate(password)) {
           return res.status(401).json({
               error: 'Email and password dont match'
           })
       }

       // generate a signed token with user id and secret
       const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
       // persist the token as 't' in cookie with expire date
       res.cookie('t', token, {expire: new Date() + 9999})
       // return response with user and token to frontend client
       const {_id, name, email, role} = user
       return res.json({token, user: {_id, email, name, role}})
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({message: "Signout Success"})

}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});