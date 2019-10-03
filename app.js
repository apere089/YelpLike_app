const express = require('express'),
bodyParser    = require('body-parser'),
Campsite      = require('./models/campsites'),
Comment       = require('./models/comments'),
mongoose      = require('mongoose'),
seedDB				= require('./seeds'),
app           = express();

seedDB();
//=========== App_Setup ==========
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//=========== Db_Setup ==========
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useUnifiedTopology: true, useNewUrlParser: true});

//=========== Routes_Setup ==========
app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campsites', (req, res) => {
  Campsite.find({}, (err, camps) => {
    if(err)
      console.error(err);
    else
      res.render('campsites/index', {camps: camps});
  });
});

app.post('/campsites', (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  Campsite.create({name: name, image: image, description: desc}, (err, camp) => {
    if(err)
      console.error(err);
    else
      res.redirect('/campsites');
  });
});

app.get('/campsites/new', (req, res) => {
  res.render('campsites/new');
});

app.get('/campsites/:id', (req, res) => {
  Campsite.findById(req.params.id).populate('comments').exec((err, camp) => {
    if(err)
      console.error(err);
    else
      res.render('campsites/show', {camp: camp});
  });
});

app.get('/campsites/:id/comments/new', (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err)
      console.error(err);
    else
      res.render('comments/new', {camp: camp});
  });
});

app.post('/campsites/:id/comments', (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err)
      console.error(err);
    else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err)
          console.error(err);
        else {
          camp.comments.push(comment);
          camp.save();
          res.redirect('/campsites/' + camp._id);
        }
      });
    }
  });
});
//=========== /Routes_Setup ==========

//=========== Server_Init ==========
app.listen(3000, () => console.log('YelpCamp Server Started - Listening on Port 3000'));