/* content.js */

var ContentProvider = require('../models/content.js');
var ContentPoster = function(){};

/* Functions */
ContentPoster.post = function(userid, stringlet, cb) {
  convertAndPostStringlet(userid, stringlet, function(err, content) {
    if (err) { cb(err); }
    cb(null, content);
  });
};

/* Helper Functions */
function convertAndPostStringlet(userid, stringlet, cb) {
  var data = {};
    
  if (isImage(stringlet)) {
    data.userid = userid;
    data.type = 'IMAGE';
    data.half = true;
    data.content = stringlet;
    postContent(data, function(err, content) {
      if (err) { cb(err); }
      cb(null, content);
    });
  }
  else {
    data.userid = userid;
    data.type = 'STRING';
    data.half = false;
    data.content = decodeURI(stringlet);
    postContent(data, function(err, content) {
      if (err) { cb(err); }
      cb(null, content);
    });
  }
}

function postContent(content, cb) {
  ContentProvider.save(content, function(err, content) {
    if (err) { cb(err); }
    cb(null, content);
  });
}

function isImage(stringlet) {
  if (stringlet.indexOf(".jpg") > -1 || stringlet.indexOf(".jpeg") > -1 || stringlet.indexOf(".gif") > -1 || stringlet.indexOf(".png") > -1)
    return true;
  else
    return false;
}

module.exports = ContentPoster;