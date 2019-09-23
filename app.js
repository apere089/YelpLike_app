const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//=========== App_Setup ==========
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
//=========== /App_Setup ==========

//=========== Db_Setup ==========
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useUnifiedTopology: true, useNewUrlParser: true});
var campsiteSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
var Campsite = mongoose.model('Campsite', campsiteSchema);
//=========== /Db_Setup ==========

//INIT Db
// var newCamp = {
//   name: 'Forest Ravine', 
//   image: 'https://cdn.hiconsumption.com/wp-content/uploads/2019/07/Best-Affordable-Camping-Gear-000-Hero.jpg',
//   description: 'Beautiful nature! Full camping experience in secluded ravine. Night campfires!!'
// }
// Campsite.create(newCamp, (err, newCamp) => {
//   if(err)
//     console.error(err);
//   else
//     console.log(newCamp);
// });

//=========== Routes_Setup ==========
app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campsites', (req, res) => {
  Campsite.find({}, (err, camps) => {
    if(err)
      console.error(err);
    else
      res.render('index', {camps: camps});
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
  res.render('new');
});

app.get('/campsites/:id', (req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err)
      console.error(err);
    else
      res.render('show', {camp: camp});
  });
});
//=========== /Routes_Setup ==========

//=========== Server_Init ==========
app.listen(3000, () => console.log('YelpCamp Server Started - Listening on Port 3000'));