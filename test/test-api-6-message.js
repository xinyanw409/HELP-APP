let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');

let PORT = 3002;
let HOST = 'http://localhost:' + PORT;

suite('API 6 TESTS: ', function () {

  // test for get('/messages/privateMessages/:text')
  test('Should search private chat successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        var uri = HOST + '/messages/privateMessages/' + 'Hello';
        agent.get(uri)
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

  // test for get('/messages/publicMessages/:text')
  test('Should search public chat successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        var uri = HOST + '/messages/publicMessages/' + 'test';
        agent.get(uri)
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

  // test for get('/messages/publicHistory')
  test('Should get public history successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.get(HOST + '/messages/publicHistory')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

  // test for get('/messages/privateHistory')
  test('Should get public history successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.get(HOST + '/messages/privateHistory/chen')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

})