var UserProvider = require('../models/user.js');

function registerMW(req, res, next) {
  var userProvider = new UserProvider({ username : req.body.email });

  //TODO: Server side authentication
  UserProvider.register(userProvider, req.body.password, function(err, account) {
    if (err) { res.status(403).json({ reason: err }); } 
    else { res.status(200); }
  });
}

module.exports = registerMW;