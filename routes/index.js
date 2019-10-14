const express = require('express'),
router        = express.Router(),
passport      = require('passport'),
User          = require('../models/users');

//Landing route
router.get('/', (req, res) => {
  res.render('landing');
});
//Register route
router.get('/register', (req, res) => {
  res.render('register');
});
//Register post route - for registering new user
router.post('/register', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err) {
      req.flash('error', err.message);
      return res.redirect('/register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Welcome to YelpCamp ' + user.username);
      res.redirect('/campsites');
    });
  });
});
//Login route
router.get('/login', (req, res) => {
  res.render('login');
});
//Login post route - to longin user
router.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/campsites',
    successFlash: 'Welcome back',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password'
  }), (req, res) => { 
});
//Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged Out!');
  res.redirect('/campsites');
});

module.exports = router;