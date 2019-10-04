const express = require('express'),
router        = express.Router({mergeParams: true}),
Campsite      = require('../models/campsites'),
Comment       = require('../models/comments');
//New comment route
router.get('/new', isLoggedIn,(req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err)
      console.error(err);
    else
      res.render('comments/new', {camp: camp});
  });
});
//New comment post route - for adding new comments
router.post('/', isLoggedIn, (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err)
      console.error(err);
    else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err)
          console.error(err);
        else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          camp.comments.push(comment);
          camp.save();
          res.redirect('/campsites/' + camp._id);
        }
      });
    }
  });
});
//Loggedin middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/login');
}

module.exports = router;