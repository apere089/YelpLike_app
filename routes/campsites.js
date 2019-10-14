const express = require('express'),
router        = express.Router(),
Campsite      = require('../models/campsites'),
Comment       = require('../models/comments'),
middleware    = require('../middleware');
//Index route
router.get('/', (req, res) => {
  Campsite.find({}, (err, camps) => {
    if(err)
      console.log(err);
    else
      res.render('campsites/index', {camps: camps});
  });
});
//New post route - for adding new Camps
router.post('/', middleware.isLoggedIn,(req, res) => {
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
      console.log(err);
    else
      res.redirect('/campsites');
  });
});
//New route
router.get('/new', middleware.isLoggedIn,(req, res) => {
  res.render('campsites/new');
});
//Show route
router.get('/:id', (req, res) => {
  Campsite.findById(req.params.id).populate('comments').exec((err, camp) => {
    if(err || !camp) {
      console.log(err);
      req.flash('error', 'Sorry, that campsite does not exist');
      res.redirect('back');
    } 
    else
      res.render('campsites/show', {camp: camp});
  });
});
//Edit route
router.get('/:id/edit', middleware.checkCampsiteOwnership, (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err || !camp) {
      console.log(err);
      req.flash('error', 'Sorry, that campsite does not exist');
      res.redirect('/campsites');
    }
    else {
      req.flash('success', 'Successfully edited campsite');
      res.render('campsites/edit', {camp: camp});
    }
      
  });
});
//Update route
router.put('/:id', middleware.checkCampsiteOwnership, (req, res) => {
  Campsite.findByIdAndUpdate(req.params.id, req.body.campsite, (err, camp) => {
    if(err || !camp) {
      req.flash('error', 'Sorry, that campsite does not exist');
      res.redirect('/campsites');
    }
    else {
      req.flash('success', 'Successfully edited campsite');
      res.redirect('/campsites/' + req.params.id);
    }
     
  });
});
//Delete route
router.delete('/:id', middleware.checkCampsiteOwnership, (req, res) => {
  Campsite.findByIdAndRemove(req.params.id, (err, camp) => {
    if(err || !camp) {
      req.flash('error', 'Sorry, that campsite does not exist');
      res.redirect('/campsites');
    }
    else {
      Comment.deleteMany({ _id: {$in: this.comments}}, (err) => {
        if(err)
          console.log(err);
      });
      req.flash('success', 'Successfully deleted campsite');
      res.redirect('/campsites');
    }
  })
});

module.exports = router;