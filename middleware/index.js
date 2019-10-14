//File for middlewares
//require models
const Campsite = require('../models/campsites'),
Comment        = require('../models/comments');

//middleware object
const middlewareObj = {};

middlewareObj.checkCampsiteOwnership = function(req, res, next) {
  if(req.isAuthenticated()) {
    Campsite.findById(req.params.id, (err, camp) => {
      if(err)
        res.redirect('back');
      else {
        if(camp.author.id.equals(req.user._id)) {
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

middlewareObj.checkCommentOwnership = function(req, res, next) {
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

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/login');
}

module.exports = middlewareObj;