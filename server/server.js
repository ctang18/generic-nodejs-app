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
var routes = require('./routes/routes');
var api = require('./routes/api');

/* Configuration */
app.use('/static', express.static(__dirname + '/../client'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect((process.env.MONGOLAB_URI || c.mongoURI));
app.use(passport.initialize());

/* Router */

app.use('/api', api);
app.use('/', routes);

/* Listen */
http.listen((process.env.PORT || c.port), function(){
  console.log('listening on localhost:' + (process.env.PORT || c.port));
});