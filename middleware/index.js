//File for middlewares
//require models
const Campsite = require('../models/campsites'),
Comment        = require('../models/comments');

//middleware object
const middlewareObj = {};

middlewareObj.checkCampsiteOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Campsite.findById(req.params.id, (err, camp) => {
      if(err || !camp) {
        req.flash('error', 'Sorry, that campsite does not exits');
        res.redirect('/campsites');
      }
      else {
        if(camp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You don\'t have permission to do that');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if(err || !comment) {
        req.flash('error', 'Sorry, that comment does not exist');
        res.redirect('/campsites');
      }
      else {
        if(comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You don\'t have permission to do that');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated())
    return next();
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
}

module.exports = middlewareObj;