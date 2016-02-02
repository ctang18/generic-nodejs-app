var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/* Schemas */
var userSchema = new Schema({
    verified : { type: Boolean, default: false},
    onboard  : { type: Boolean, default: true}
});

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

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema)

/* Content */
var Content = mongoose.model('Content', contentSchema);
var ContentProvider = function(){};

ContentProvider.prototype.findContents = function(userid, callback) {
    console.log('Finding ' + userid);
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

ContentProvider.prototype.remove = function(params, callback) {
    Content.remove({_id : params['_id']}, function(err){
        callback(err);
    });
};

exports.User = User;
exports.ContentProvider = ContentProvider;

/* Helper Functions */