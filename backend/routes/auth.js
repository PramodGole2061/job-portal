const express = require('express');
const { default: mongoose, mongo } = require('mongoose');
const router = express.Router();
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

// for the last part of token. it is a secret key word
const JWT_SECRET = process.env.JWT_SECRET;

// Route: 1 create a User using: POST "api/auth/createUser". no login required
router.post('/createUser',[body('name','Enter valid name').isLength({min: 3}),body('email','Enter valid email').isEmail(),body('password','Password must at least 5 characters long').isLength({min: 5})], async(req, res)=>{
    console.log(req.body);
    let success = false;
    // if there are errors, return bad request and return errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
  try{
    // Check if the user's email exits or not
    let user = await User.findOne({email: req.body.email}); //this .finOne() only takes object
    if(user){
      return res.status(400).json({success ,errors: 'Sorry! An user with this email already exits!'});
    }

    // using bcryptjs methods to encrypt/hash user's password along with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user and add them to the database with collection called 'user'
    user = await User.create({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email
    })

    //To create a token to send to the users
    const data = {
      user: {
        id: user.id
      }
    }
    
    const token = jwt.sign(data, JWT_SECRET);
    success = true
    res.json({success,token: token});
    // res.json({"User added successfully": user})
    // .then(user => res.json(user)).catch(err=>{console.log(err);
    // res.json({Error: "Error: Enter unique email.", Message: err.message})})
  }catch(err){
    return res.status(400).json({"Internal server error": err.message});
  }
})


//Route: 2 Authenticate a User using: POST "api/auth/login".
router.post(
  '/login',
  // username must be an email
  body('email', 'Enter valid email').isEmail(),
  // password must be at least 5 chars long
  body('password', 'Password can not be empty').exists(),
  async (req, res) => {
  let success = false;
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body
  try{
    // check if email exits and password match
    let user = await User.findOne({email: email});
    if(!user){
      success = false;
      return res.json({success: success,error: "Incorrect email login credentials."});
    }
    const passwordCompare = await bcrypt.compare(password,user.password)
    if(!passwordCompare){
      console.log(user.password)
      success = false;
      return res.json({success: success,error: "Incorrect password login credentials."});
    }

    //since login credentials ara correct at this point generate a unique token and send in response
    const data = {
      user:{
        id: user.id
      }
    }
    const token = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success: success,token: token});  
  }catch(err){
    return res.status(400).json({ "Internal server error": err.message});
  }
})


// Routed: 3 Display user's information using: POST "api/auth/getUser". Login required
router.post(
  '/getUser',fetchUser,
  async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(req.user);
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    return res.status(400).json({ "Internal server error": error.message});
  }
})

module.exports = router;