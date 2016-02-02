/* Modules */
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var c = require('./config.json');
var ContentProvider = require('./models/content.js');
var UserProvider = require('./models/user.js');
var ContentHelper = require('./js/contentUtil.js');

/* Configuration */
app.use('/static', express.static(__dirname + '/../client'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect((process.env.MONGOLAB_URI || c.mongoURI));
passport.use(new LocalStrategy(UserProvider.authenticate()));
passport.serializeUser(UserProvider.serializeUser());
passport.deserializeUser(UserProvider.deserializeUser());

/* API */
app.get('/api/content', function(req, res){
  ContentProvider.findContents(req.user._id, function(err, contents){
    if (err)
      res.send(err)

    res.json(contents); 
  });
});

app.post('/api/content', function(req, res) {
  
});

/* Router */
app.get('/', function(req, res){
  if(req.user) {
    res.sendFile('index.html');
  } else {
    res.redirect('/login');
  }
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname + '/../client/register.html'));
});

app.post('/register', function(req, res) {
  UserProvider.register(new UserProvider({ username : req.body.email }), req.body.password, function(err, account) {
    if (err) {
        res.json({success: false, reason: err});
    } else {
      res.json({success: true});
    }
  });
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname + '/../client/login.html'));
});

app.post('/login', passport.authenticate('local'), function(req, res, next) {
  //TODO Send back errors
  res.redirect('/');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('*', function(req, res){
  res.redirect('/')
});

/* Listen */
http.listen((process.env.PORT || c.port), function(){
  console.log('listening on localhost:' + (process.env.PORT || c.port));
});