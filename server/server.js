/* Modules */
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TokenStrategy = require('passport-token').Strategy;

var c = require('./config.json');
var ContentProvider = require('./models/content.js');
var UserProvider = require('./models/user.js');
var ContentHelper = require('./js/contentutil.js');

/* Configuration */
app.use('/static', express.static(__dirname + '/../client'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect((process.env.MONGOLAB_URI || c.mongoURI));
app.use(passport.initialize());
passport.use(new LocalStrategy(UserProvider.authenticate()));
passport.serializeUser(UserProvider.serializeUser());
passport.deserializeUser(UserProvider.deserializeUser());
passport.use(new TokenStrategy(function (username, token, done) {
  UserProvider.findOne({username: username}, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    jwt.verify(token, c.jwtSecret, function(err, decoded) {
      if (err) {
        //Handle expired tokens
        return done(null, false);
      }
        return done(null, user);
    });
  });
}));

var minChar = 4;
var maxChar = 20;

/* API */
app.get('/api/content', passport.authenticate('token'), function(req, res){
  ContentProvider.findContents(req.user._id, function(err, contents){
    if (err)
      res.send(err)
    res.json({success: true, contents: contents}); 
  });
});

app.post('/api/content', passport.authenticate('token'), function(req, res) {
  if(req.body.text)
    ContentHelper.post(req.user._id, req.body.text);
  res.json({success: true}); 
});

/* Router */
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname + '/../client/register.html'));
});

app.post('/register', function(req, res) {
  //TODO: Server side authentication
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

app.post('/login', function(req, res, next) {
  //TODO: Server side authentication
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.json({success: false, reason: err}); }
    if (!user) {
      return res.json({success: false, reason: "Login Failed"});
    }
    var token = jwt.sign({ 'username' : req.body.username }, c.jwtSecret);
    res.json({success: true, token: token});
  })(req, res, next);
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

/* Helper Functions */
function validateAccount(username, password, cb){
  if(username.length < minChar || username.length > maxChar){
    return cb({message: "Username must be between " + minChar + " and " + maxChar + " characters"});
  } else if(password.length < minChar || password.length > maxChar) {
    return cb({message: "Password must be between " + minChar + " and " + maxChar + " characters"});
  } else if(!alphaNumeric(username) || !validPassword(password)){
    return cb({message: "Alphanumerical characters only"});
  } else {
    return cb(null);
  }
}

function alphaNumeric(str){
  return /[^a-zA-Z0-9]/.test(str) ? false : true;
}

function validPassword(str){
  return /^[a-zA-Z0-9!@#$%&*]+$/.test(str) ? true : false;
}