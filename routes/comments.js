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
//Edit comment route
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if(err)
      res.redirect('back');
    else
      res.render('comments/edit', {campsite_id: req.params.id, comment: comment});
  });
});
//Edit comment post route -  for editing comments
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
    if(err)
      res.redirect('back');
    else
      res.redirect('/campsites/' + req.params.id);
  });
});
//Delete comments route
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err)
      res.redirect('back');
    else
      res.redirect('/campsites/' + req.params.id);
  })
});
//Loggedin middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/login');
}
//Campsite ownership middleware
function checkCommentOwnership(req, res, next) {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if(err)
        res.redirect('back');
      else {
        if(comment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = router;