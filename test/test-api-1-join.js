let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');
let User = require('../models/user');

let PORT = 3002;
let HOST = 'http://localhost:' + PORT;

// Initiate Server
let app = require('../app');

let server = app.listen(PORT);

const userCredentials = {
  username: '12345', 
  password: '12345'
}

suite('API 1 TESTS: ', function () {

  test('Can not assess wrong routing url', function (done) {
    agent.get(HOST + '/user')
      .end(function (err, res) {
      expect(res.statusCode).to.be.equal(404);
    });
    done();
  });
    
  test('Can assess login url', function (done) {
    var authenticatedUser = request.agent(app);
    authenticatedUser
      .post('/users/login')
      .send(userCredentials)
      .end(function(err, response){
        expect(response.statusCode).to.equal(200);
      });
    done();
  });
    
  // test for register
  test('Should reject register if parameter not enough', function (done) {
    var data = {password:"asdf", confirm_password:"asdf"};
    agent.post(HOST + '/users')
      .send(data)
      .end(function (err, res) {
        expect(res.statusCode).to.be.equal(400);
      });
      done();
  });
    
  test('Should reject register with existed username', function (done) {
    var data = {username:"xinyan", password:"asdf", confirm_password:"asdf"};
    agent.post(HOST + '/users')
      .send(data)
      .end(function (err, res) {
        console.log("should fail register");
        expect(res.statusCode).to.be.equal(400);
      });
      done();
  });
    
  test('Should reject register if passwords do not match', function (done) {
    var data = {username:"testUser1", password: "123", confirm_password:"1234"};
    agent.post(HOST + '/users')
      .send(data)
      .end(function (err, res) {
        expect(res.body.auth).to.be.equal(0);
      });
      done();
  });
    
  test('Should register user with right response code', function (done) {
    User.find({username:'testUser2'}).remove().exec();
    var data = {username:"testUser2", password: "1234", confirm_password:"1234"};
    agent.post(HOST + '/users')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send(data)
      .end(function (err, res) {
        expect(res.statusCode).to.be.equal(200);
      });
      done();
  });

})