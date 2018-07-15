var sinon = require('sinon');
let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');
let Activity = require('../models/activity');

let PORT = 3002;
let HOST = 'http://localhost:' + PORT;

// Initiate Server

suite('ACTIVITY API TESTS: ', function () {

  // test for get('/activities')
  test('Should get activity list successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.get(HOST + '/activities')
          .send('username=xinyanw')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

  // test for post('/activities')
  test('Should post activity successfully', function (done) {
    Activity.find({title:'testTitle'}).remove().exec();
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.post(HOST + '/activities')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        agent.post(HOST + '/activities')
          .set('x-access-token', res.body.token)
          .send('username=xinyanw')
          .send('title=testTitle')
          .send('location=testLocation')
          .send('startDate=2018-02-01T11:30:00.991Z')
          .send('endDate=2018-03-06T14:00:00.009Z')
          .send('description=description')
          .send('spots=30')
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

    // test for post('/activities/register')
  test('Should register activity successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.post(HOST + '/activities/register')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        agent.post(HOST + '/activities/register')
          .set('x-access-token', res.body.token)
          .send('title=Escape')
          .send('username=xinyanw')
          .send('email=email@email')
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

  // test for post('/activities/unregister')
  test('Should unregister activity successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.post(HOST + '/activities/unregister')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        agent.post(HOST + '/activities/unregister')
          .set('x-access-token', res.body.token)
          .send('title=Escape')
          .send('username=xinyanw')
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

})