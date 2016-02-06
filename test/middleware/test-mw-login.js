var chai = require('chai');
var should = chai.should();
var mongoose = require('mongoose');

var User = require('../../server/models/user');
var Content = require('../../server/models/content');

var passport = require('passport');
var jwt = require('jsonwebtoken');

var loginMW = require('../../server/routes/login');

describe('Login Middleware', function() {
  it('should 200 on successful login authorization');
  it('should 401 on wrong username/password');
});