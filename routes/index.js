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
      console.error(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
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
    failureRedirect: '/login'
  }), (req, res) => { 
});
//Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campsites');
});
//Loggedin middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/login');
}
module.exports = router;