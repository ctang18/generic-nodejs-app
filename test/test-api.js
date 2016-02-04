var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app-factory');
var should = chai.should();

chai.use(chaiHttp);

describe('API', function() {
  it('should list ALL blobs on /api/content GET');
  it('should add a SINGLE blob on /api/content POST');
});