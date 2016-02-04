var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app-factory');
var should = chai.should();

chai.use(chaiHttp);

describe('Routes', function() {
  it('should register a user on /register POST');
  it('should login a user on /login POST');
});