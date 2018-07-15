let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');
let Message = require('../models/message.js');

let PORT = 3002;
let HOST = 'http://localhost:' + PORT;

suite('API 4 TESTS: ', function () {

  // test for post('/messages/announcements')
  test('Should fail post announcements', function (done) {
    Message.find({content:'testPostAnnounce'}).remove().exec();
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.post(HOST + '/messages/announcements')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        agent.post(HOST + '/messages/announcements')
          .send('content=testPostAnnounce')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        done();
      });
  });

  test('Should post announcements successfully', function (done) {
    Message.find({content:'testPostAnnounce'}).remove().exec();
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=ESNAdmin')
      .send('password=undefinedYWRtaW4=')
      .end(function (err, res) {
        agent.post(HOST + '/messages/announcements')
          .send('content=testPostAnnounce')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

  // test for get('/messages/announcements')
  test('Should fail auth if no token', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        var data = {};
        agent.get(HOST + '/messages/announcements')
          .send(data)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(403);
          });
        done();
      });
  });

  test('Should fail auth if token is wrong', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        var data = {};
        agent.get(HOST + '/messages/announcements')
          .set('x-access-token', 'res.body.token')
          .send(data)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(500);
          });
        done();
      });
  });

  test('Should get announcements successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.get(HOST + '/messages/announcements')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

})