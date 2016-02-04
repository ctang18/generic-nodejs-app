var ContentProvider = require('../../models/content.js');

function getContentMW(req, res, next) {
  ContentProvider.findContents(req.user._id, function(err, contents){
    if (err){
      console.log("error" + err);
      res.send(err)
    }
    res.json({success: true, contents: contents}); 
  });
}

module.exports = getContentMW;