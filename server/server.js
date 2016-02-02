/* Modules */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var c = require('./config.json');
var model = require('./js/model.js');

var port = process.env.PORT || c.port;

/* Configuration */
app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect((process.env.MONGOLAB_URI || c.mongoURI));



var contentProvider = new model.ContentProvider;

/* API */
app.get('/api/content', function(req, res){
  contentProvider.getContent(Date.now(), function(err, currentContent, upcomingContent, missedContent) {
    if(err){
      res.json({success: false});
    } else {
      var result = {
        success         : true, 
        currentContent  : currentContent,
        upcomingContent : upcomingContent, 
        missedContent  : missedContent
      };
      res.json(result);
    }  
  });
});

/* Router */
app.get('/', function(req, res){
  res.sendfile('index.html');
});

//Create fake content for demoing purposes
app.get('/demo', function(req, res){
  var startDate = new Date(Date.now());
  var endDate = new Date(Date.now());
  //startDate.setHours(startDate.getHours() + 2);
  endDate.setHours(endDate.getHours() + 1);
  var content = {
    title    : "Steelers @ Broncos",
    start    : startDate,
    end      : endDate,
    networks : ["CBS"],
    streams  : [],
    hashtags : ["#PITatDEN", "#Broncos", "#Steelers"],
    image    : "demo/1.jpg"
  };
  
  contentProvider.createContent(content, function(err){
    if(err){
      res.json({success: false, err: err});
    } else {
      res.json({success: true});
    }
  });
});

app.get('*', function(req, res){
  res.redirect('/')
});

/* Application */
http.listen(port, function(){
  console.log('listening on localhost:' + port);
});

/* Helper Functions */
