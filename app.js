const express = require('express'),
bodyParser    = require('body-parser'),
User          = require('./models/users'),
passport      = require('passport'),
LocalStrategy = require('passport-local'),
methodOverride = require('method-override'),
mongoose      = require('mongoose'),
flash         = require('connect-flash'),
seedDB				= require('./seeds'),
app           = express();

const commentRoutes = require('./routes/comments'),
campsiteRoutes = require('./routes/campsites'),
authRoutes = require('./routes/index');

//=========== App_Setup ==========
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();

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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
//Route files
app.use('/', authRoutes);
app.use('/campsites/:id/comments', commentRoutes);
app.use('/campsites', campsiteRoutes);


//=========== Server_Init ==========
app.listen(3000, () => console.log('YelpCamp Server Started - Listening on Port 3000'));