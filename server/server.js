/* Modules */
var express = require('express');
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
var UserProvider = require('./models/user.js');
var routes = require('./routes/routes');
var api = require('./routes/api');

/* Configuration */
app.use('/static', express.static(__dirname + '/../client'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
mongoose.connect((process.env.MONGOLAB_URI || c.mongoURI));
passport.use(new LocalStrategy(UserProvider.authenticate()));
passport.use(new TokenStrategy(function (username, token, done) {
  UserProvider.findOne({ username: username }, function (err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    jwt.verify(token, c.jwtSecret, function(err, decoded) {
      if (err) { return done(null, false); }
      return done(null, user);
    });
  });
}));

/* Router */
app.use('/api', passport.authenticate('token', { session: false }), api);
app.use('/', routes);

/* Listen */
http.listen((process.env.PORT || c.port), function(){
  console.log('listening on localhost:' + (process.env.PORT || c.port));
});