var UserProvider = require('../models/user.js');

function registerMW(req, res, next) {
  var userProvider = new UserProvider({ username : req.body.email });

  //TODO: Server side authentication
  UserProvider.register(userProvider, req.body.password, function(err, account) {
    if (err) {
      res.json({success: false, reason: err});
    } else {
      res.json({success: true});
    }
  });
}

module.exports = registerMW;