let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');

let PORT = 3002;
let HOST = 'http://localhost:' + PORT;

suite('API 3 TESTS: ', function () {

  // test for post('/users/status')
  test('Should update status successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        var uri = HOST + '/users/status';
        agent.post(uri)
          .set('x-access-token', res.body.token)
          .send('lastStatusCode=3')
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        agent.post(uri)
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        done();
      });
  });

  // test for get('/users')
  test('Should get user list successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.get(HOST + '/users')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
      done();
    });
  });

  // test for get('/users/username/:username')
  test('Should search using username successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {        
        var uri = HOST + '/users/username/' + 'xinyanw';
        agent.get(uri)
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

  // test for get('/users/status/:statusCode')
  test('Should search by status successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        var uri = HOST + '/users/status/' + 'ok';
        agent.get(uri)
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        uri = HOST + '/users/status/' + 'help';
        agent.get(uri)
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        uri = HOST + '/users/status/' + 'emergency';
        agent.get(uri)
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        uri = HOST + '/users/status/' + 'undefined';
        agent.get(uri)
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });
  });

})