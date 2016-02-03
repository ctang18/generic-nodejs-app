/* content.js */

var ContentProvider = require('../models/content.js');
var ContentPoster = function(){};

/* Functions */
ContentPoster.post = function(userid, stringlet) {
  convertAndPostStringlet(userid, "Test");
  convertAndPostStringlet(userid, "http://i.4cdn.org/sp/1454464610068.jpg");
};

/* Helper Functions */
function convertAndPostStringlet(userid, stringlet) {
  var data = {};
    
  if (isImage(stringlet)) {
    data.userid = userid;
    data.type = 'IMAGE';
    data.half = true;
    data.content = stringlet;
    postContent(data);
  }
  else {
    data.userid = userid;
    data.type = 'STRING';
    data.half = false;
    data.content = decodeURI(stringlet);
    postContent(data);
  }
}

function postContent(content) {
  ContentProvider.save(content, function(err, todo) {
    if (err) {
      console.log("Error: " + err);
    }
  });
}

function isImage(stringlet) {
  if (stringlet.indexOf(".jpg") > -1 || stringlet.indexOf(".jpeg") > -1 || stringlet.indexOf(".gif") > -1 || stringlet.indexOf(".png") > -1)
    return true;
  else
    return false;
}

module.exports = ContentPoster;