var express = require('express');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var TokenStrategy = require('passport-token').Strategy;

var c = require('../config.json');
var UserProvider = require('../models/user.js');
var ContentProvider = require('../models/content.js');
var ContentHelper = require('../js/contentutil.js');

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

module.exports = (function(){
  var api = express.Router();
  
  api.get('/content', passport.authenticate('token', { session: false }), function(req, res){
    ContentProvider.findContents(req.user._id, function(err, contents){
      if (err){
        console.log("error" + err);
        res.send(err)
      }
      res.json({success: true, contents: contents}); 
    });
  });

  api.post('/content', passport.authenticate('token', { session: false }), function(req, res) {
    if(req.body.text)
      ContentHelper.post(req.user._id, req.body.text);
    res.json({success: true}); 
  });
  
  return api;
})();