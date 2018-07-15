let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');

let PORT = 3002;
let HOST = 'http://localhost:' + PORT;

suite('API 7 TESTS: ', function () {
  // test for post('/users/position')
  test('Should require parameter', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.post(HOST + '/users/position')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        done();
      });
  });

  test('Should update position successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.post(HOST + '/users/position')
          .set('x-access-token', res.body.token)
          .send('lat=30')
          .send('lng=70')
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });
})