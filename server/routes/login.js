var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config.json');

function loginMW(req, res, next) {
  //TODO: Server side authentication
  passport.authenticate('local', { session: false }, function(err, user, info) {
    if (err) { return res.json({success: false, reason: err}); }
    if (!user) {
      return res.json({success: false, reason: "Login Failed"});
    }
    var token = jwt.sign({ 'username' : req.body.username }, config.jwtSecret);
    res.json({success: true, token: token});
  })(req, res, next);
}

module.exports = loginMW;