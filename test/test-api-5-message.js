let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');
let Message = require('../models/message.js');

let PORT = 3002;
let HOST = 'http://localhost:' + PORT;

suite('API 5 TESTS: ', function () {

  // test for get('/messages/announcements/:text')
  test('Should search announcement successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        var uri = HOST + '/messages/announcements/' + 'announce';
        agent.get(uri)
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });
  
  // test for post('/messages/publicMessages')
  test('Should chat public message successfully', function (done) {
    Message.find({content:'testPostPublic'}).remove().exec();
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.post(HOST + '/messages/publicMessages')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        agent.post(HOST + '/messages/publicMessages')
          .send('username=xinyanw')
          .send('content=testPostPublic')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

  // test for post('/messages/privateMessages')
  test('Should chat private message successfully', function (done) {
    Message.find({content:'testPrivateChat'}).remove().exec();
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.post(HOST + '/messages/privateMessages')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        agent.post(HOST + '/messages/privateMessages')
          .send('username=xinyanw')
          .send('otherusername=1234')
          .send('content=testPrivateChat')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });
  
})