const express = require('express'),
router        = express.Router(),
Campsite      = require('../models/campsites'),
Comment       = require('../models/comments');
//Index route
router.get('/', (req, res) => {
  Campsite.find({}, (err, camps) => {
    if(err)
      console.error(err);
    else
      res.render('campsites/index', {camps: camps});
  });
});
//New post route - for adding new Camps
router.post('/', isLoggedIn,(req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampsite = {name: name, image: image, description: desc, author: author};
  Campsite.create(newCampsite, (err, camp) => {
    if(err)
      console.error(err);
    else
      res.redirect('/campsites');
  });
});
//New route
router.get('/new', isLoggedIn,(req, res) => {
  res.render('campsites/new');
});
//Show route
router.get('/:id', (req, res) => {
  Campsite.findById(req.params.id).populate('comments').exec((err, camp) => {
    if(err)
      console.error(err);
    else
      res.render('campsites/show', {camp: camp});
  });
});
//Edit route
router.get('/:id/edit', checkCampsiteOwnership, (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
        res.render('campsites/edit', {camp: camp});
  });
});
//Update route
router.put('/:id', checkCampsiteOwnership, (req, res) => {
  Campsite.findByIdAndUpdate(req.params.id, req.body.campsite, (err, camp) => {
    if(err)
      res.redirect('/campsites');
    else 
      res.redirect('/campsites/' + req.params.id);
  });
});
//Delete route
router.delete('/:id', checkCampsiteOwnership, (req, res) => {
  Campsite.findByIdAndRemove(req.params.id, (err, camp) => {
    if(err)
      res.redirect('/campsites');
    else {
      Comment.deleteMany({ _id: {$in: this.comments}}, (err) => {
        if(err)
          console.error(err);
      });
      res.redirect('/campsites');
    }
  })
});

//Middleware functions
//Loggedin middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/login');
}
//Campsite ownership middleware
function checkCampsiteOwnership(req, res, next) {
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

module.exports = router;