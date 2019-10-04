const express = require('express'),
bodyParser    = require('body-parser'),
Campsite      = require('./models/campsites'),
Comment       = require('./models/comments'),
User          = require('./models/users'),
passport      = require('passport'),
LocalStrategy = require('passport-local'),
mongoose      = require('mongoose'),
seedDB				= require('./seeds'),
app           = express();


//=========== App_Setup ==========
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useUnifiedTopology: true, useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
seedDB();

//=========== Passport_Config ==========
app.use(require('express-session')({
  secret: 'YelpCamp Secret Code String',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=========== Middleware ==========
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


//=========== Routes_Setup ==========
//Landing route
app.get('/', (req, res) => {
  res.render('landing');
});
//Index route
app.get('/campsites', (req, res) => {
  Campsite.find({}, (err, camps) => {
    if(err)
      console.error(err);
    else
      res.render('campsites/index', {camps: camps});
  });
});
//New post route - for adding new Camps
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
//New route
app.get('/campsites/new', (req, res) => {
  res.render('campsites/new');
});
//Show route
app.get('/campsites/:id', (req, res) => {
  Campsite.findById(req.params.id).populate('comments').exec((err, camp) => {
    if(err)
      console.error(err);
    else
      res.render('campsites/show', {camp: camp});
  });
});
//New comment route
app.get('/campsites/:id/comments/new', isLoggedIn,(req, res) => {
  Campsite.findById(req.params.id, (err, camp) => {
    if(err)
      console.error(err);
    else
      res.render('comments/new', {camp: camp});
  });
});
//New comment post route - for adding new comments
app.post('/campsites/:id/comments', isLoggedIn, (req, res) => {
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
//AUTH routes
//Register route
app.get('/register', (req, res) => {
  res.render('register');
});
//Register post route - for registering new user
app.post('/register', (req, res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err) {
      console.error(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campsites');
    });
  });
});
//Login route
app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/campsites',
    failureRedirect: '/login'
  }), (req, res) => { 
});
//Logout
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campsites');
});
//Loggedin middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/login');
}

//=========== Server_Init ==========
app.listen(3000, () => console.log('YelpCamp Server Started - Listening on Port 3000'));