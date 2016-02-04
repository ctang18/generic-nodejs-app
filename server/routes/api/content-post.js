var ContentHelper = require('../../util/contentutil.js');

function postContentMW(req, res, next) {
  if(req.body.text){
    ContentHelper.post(req.user._id, req.body.text, function(err, content){
    if(err){ 
      //TODO: Check err for status code to return
      res.status(401); 
    }
    res.status(200).json({ content: content }); 
    });
  }
  res.status(304); 
}

module.exports = postContentMW;