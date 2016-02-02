var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/* Schema */
var contentSchema = new Schema({
    userid     : ObjectId,
    content    : String,
    original   : String,
    embed      : String,
    title      : String,
    img        : String,
    type       : String,
    half       : Boolean,
    postdate   : { type: Date, default: Date.now },
    lastupdate : { type: Date, default: Date.now }
});

/* Functions */
var Content = mongoose.model('Content', contentSchema);
var ContentProvider = function(){};

ContentProvider.prototype.findContents = function(userid, callback) {
  Content.find({ 'userid': userid }).sort({postdate: -1}).exec(function(err, contents) {
    callback(err, contents);
  });
};

ContentProvider.prototype.save = function(params, callback) {
  var content  = new Content({
    userid     : params['userid'],
    content    : params['content'],
    embed      : params['embed'],
    title      : params['title'],
    img        : params['img'],
    type       : params['type'],
    half       : params['half']
  });
  content.save(function(err){
    console.log(err);
    callback(err);
  });
};

module.exports = ContentProvider;