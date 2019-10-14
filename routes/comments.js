const express = require('express'),
router        = express.Router({mergeParams: true}),
Campsite      = require('../models/campsites'),
Comment       = require('../models/comments'),
middleware    = require('../middleware');
//New comment route
router.get('/new', middleware.isLoggedIn,(req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err)
      console.error(err);
    else
      res.render('comments/new', {camp: camp});
  });
});
//New comment post route - for adding new comments
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if(err)
      res.redirect('back');
    else
      res.render('comments/edit', {campsite_id: req.params.id, comment: comment});
  });
});
//Edit comment post route -  for editing comments
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
    if(err)
      res.redirect('back');
    else
      res.redirect('/campsites/' + req.params.id);
  });
});
//Delete comments route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err)
      res.redirect('back');
    else
      res.redirect('/campsites/' + req.params.id);
  })
});

module.exports = router;