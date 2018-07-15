let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');

let PORT = 3002;
let HOST = 'http://localhost:' + PORT;

suite('API 2 TESTS: ', function () {

  // test for login
  test('Should login fail if input is not enough', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyan')
      .end(function (err, res) {
        expect(res.statusCode).to.be.equal(400);
      });
      done();
  });

  test('Should login fail with wrong username', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinya')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        expect(res.body.auth).to.be.equal(0);
      });
      done();
  });

  test('Should login fail with wrong password', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=1111')
      .end(function (err, res) {
        expect(res.statusCode).to.be.equal(401);
      });
      done();
  });

  test('Should login in good with vaild password', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        expect(res.body.auth).to.be.equal(1);
      });
      done();
  });

})