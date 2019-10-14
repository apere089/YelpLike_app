const express = require('express'),
router        = express.Router({mergeParams: true}),
Campsite      = require('../models/campsites'),
Comment       = require('../models/comments'),
middleware    = require('../middleware');
//New comment route
router.get('/new', middleware.isLoggedIn,(req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err)
      console.log(err);
    else
      res.render('comments/new', {camp: camp});
  });
});
//New comment post route - for adding new comments
router.post('/', middleware.isLoggedIn, (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err) {
      req.flash('error', 'Something went wrong finding campsire on database');
      console.log(err);
    }
    else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err) {
          req.flash('error', 'Something went wrong fidning comments in database');
          console.log(err);
        }
        else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          camp.comments.push(comment);
          camp.save();
          req.flash('success', 'Successfully added comment');
          res.redirect('/campsites/' + camp._id);
        }
      });
    }
  });
});
//Edit comment route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err || !camp) {
      req.flash('error', 'Sorry, that campsite does not exist');
      return res.redirect('/campsites');
    }
    Comment.findById(req.params.comment_id, (err, comment) => {
      if(err || !comment) {
        req.flash('error', 'Sorry, that comment does not exist');
        res.redirect('back');
      }
      else {
        req.flash('success', 'Comment successfully edited');
        res.render('comments/edit', {campsite_id: req.params.id, comment: comment});
      } 
    });
  });
});
//Edit comment post route -  for editing comments
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err || !camp) {
      req.flash('error', 'Sorry, that campsite does not exist');
      return res.redirect('/campsites');
    }
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
      if(err || !comment) {
        req.flash('error', 'Sorry, that comment does not exist');
        res.redirect('back');
      }
      else {
        req.flash('success', 'Comment successfully edited');
        res.redirect('/campsites/' + req.params.id);
      }  
    });
  });
});
//Delete comments route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err || !camp) {
      req.flash('error', 'Sorry, that campsite does not exist');
      return res.redirect('/campsites');
    }
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
      if(err || !comment) {
        req.flash('error', 'Sorry, that comment does not exist');
        res.redirect('back');
      }
      else {
        req.flash('success', 'Comment successfully deleted');
        res.redirect('/campsites/' + req.params.id);
      }
    })
  }); 
});

module.exports = router;