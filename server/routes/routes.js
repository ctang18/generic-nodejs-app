var express = require('express');
var path = require('path');
var jwt = require('jsonwebtoken');
var passport = require('passport');

var c = require('../config.json');
var UserProvider = require('../models/user.js');

module.exports = (function(){
  var router = express.Router();
  
  router.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/../../client/index.html'));
  });

  router.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/../../client/register.html'));
  });

  router.post('/register', function(req, res) {
    //TODO: Server side authentication
    UserProvider.register(new UserProvider({ username : req.body.email }), req.body.password, function(err, account) {
      if (err) {
        res.json({success: false, reason: err});
      } else {
        res.json({success: true});
      }
    });
  });

  router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/../../client/login.html'));
  });

  router.post('/login', function(req, res, next) {
    //TODO: Server side authentication
    passport.authenticate('local', { session: false }, function(err, user, info) {
      if (err) { return res.json({success: false, reason: err}); }
      if (!user) {
        return res.json({success: false, reason: "Login Failed"});
      }
      var token = jwt.sign({ 'username' : req.body.username }, c.jwtSecret);
      res.json({success: true, token: token});
    })(req, res, next);
  });
  
  return router;
})();