var express = require('express');

var ContentProvider = require('../models/content.js');
var ContentHelper = require('../js/contentutil.js');

module.exports = (function(){
  var api = express.Router();
  
  api.get('/content', function(req, res){
    ContentProvider.findContents(req.user._id, function(err, contents){
      if (err){
        console.log("error" + err);
        res.send(err)
      }
      res.json({success: true, contents: contents}); 
    });
  });

  api.post('/content', function(req, res) {
    if(req.body.text)
      ContentHelper.post(req.user._id, req.body.text);
    res.json({success: true}); 
  });
  
  return api;
})();