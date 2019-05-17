const express = require('express');
const router = express.Router();
const User  = require('../models/user');
const bcrypt = require('bcryptjs');
const errors = require("mongoose");
const passport = require('passport');

//Login Page
router.get('/login', (req, res, next) =>{
    res.render('login')
});

//Register Page
router.get('/register', (req, res, next) =>{
    res.render('register')
});

router.post('/register', (req, res) =>{
   const{name, email, password ,password2} = req.body;
   let errors = [];
    if(!name || !email || !password || !password2 ){
      errors.push({msg: "Please fill all fields"})
    }
    if(password !== password2){
        errors.push({msg: "Password do no match"})
    }
    if(password.length < 6){
        errors.push({msg: "Password should be at least 6 characters"})
    }
    if(errors.length > 0){
       res.render('register', {
            errors,
            name,
            email,
            password,
            password2
       });
    }
    else {
        User.findOne({email: email})
            .then(user => {
               if (user) {
                errors.push({msg: "Email is already register"});
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
               }
               else
               {
                const newUser = new User({
                    name,
                    email,
                    password,
                    password2
                });
                //Hash password
                   bcrypt.genSalt(10, (err, salt) => {
                       bcrypt.hash(newUser.password, salt, (err, hash) => {
                           if (err) throw err;
                           newUser.password = hash;
                           newUser
                               .save()
                               .then(user => {
                                   req.flash('success_msg', 'You are now registered and can log in');
                                   res.redirect('/user/login');
                               })
                               .catch(err => console.log(err));
                       });
                   });
               }
            });
    }
});
//Login Handle
router.post('/login', (req, res, next) =>{
    passport.authenticate('local',{
        successRedirect: "/dashboard",
        failureRedirect: "/user/login",
        failureFlash: true
    })(req, res, next);
});

//Log out Handle
router.get('/logout', (req, res, next)=>{
    req.logout();
    req.flash('success_mgs', 'You are logged out');
    res.redirect('/user/login');
});
module.exports = router;