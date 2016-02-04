var ContentHelper = require('../../util/contentutil.js');

function postContentMW(req, res, next) {
  if(req.body.text)
    ContentHelper.post(req.user._id, req.body.text);
  res.json({success: true}); 
}

module.exports = postContentMW;