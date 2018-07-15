let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');
let PORT = 3002;
let HOST = 'http://localhost:' + PORT;
suite('ADMINISTER API TESTS: ', function () {
  test('Should change profile successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=ESNAdmin')
      .send('password=undefinedYWRtaW4=')
      .end(function (err, res) {
        agent.put(HOST + '/users/profiles')
          .send('oldusername=xinyan')
          .send('isActive=0')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });
  test('Should fail if no privilege to change profile', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.put(HOST + '/users/profiles')
          .send('oldusername=admintest')
          .send('newusername=testad')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        done();
      });
  });
  test('Should fail if username exists', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=ESNAdmin')
      .send('password=undefinedYWRtaW4=')
      .end(function (err, res) {
        agent.put(HOST + '/users/profiles')
          .send('oldusername=admintest')
          .send('newusername=xinyan')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        done();
      });
  });
  test('Should fail if the change make the ESN has no administrator', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=ESNAdmin')
      .send('password=undefinedYWRtaW4=')
      .end(function (err, res) {
        agent.put(HOST + '/users/profiles')
          .send('oldusername=ESNAdmin')
          .send('privilege=0')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        done();
      });
  });
  test('Should create coordinator successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=ESNAdmin')
      .send('password=undefinedYWRtaW4=')
      .end(function (err, res) {
        agent.put(HOST + '/users/profiles')
          .send('oldusername=admintest')
          .send('privilege=1')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });
  test('Should fail if there is no such user', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=ESNAdmin')
      .send('password=undefinedYWRtaW4=')
      .end(function (err, res) {
        agent.put(HOST + '/users/profiles')
          .send('oldusername=xin')
          .send('privilege=0')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(404);
          });
        done();
      });
  });
})