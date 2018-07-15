let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');
let Message = require('../models/message');
var dataForRecall = {};
let PORT = 3002;
let HOST = 'http://localhost:' + PORT;
var token;
var recallId;

suite('API TESTS: ', function () {

  test('Should chat private voice message successfully', function (done) {
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
            console.log("come to set")
            expect(res.statusCode).to.be.equal(400);
          });
        agent.post(HOST + '/messages/privateMessages')
          .send('username=xinyanw')
          .send('otherusername=Marvin')
          .send('content=testPrivateChatVoice')
          .send('isVoice=true')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            var dataTest = { content: 'testPrivateChatVoice'};
            Message.findOne(dataTest, function(err, messages) {
              console.error("content! : " + messages.content)
              Message.find({_id:messages._id}).remove().exec();
            }).catch(err => console.log(err));
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });   
  });

  test('Should chat public voice message successfully', function (done) {
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
          .send('isVoice=true')
          .send('content=testPublicChatVoice')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            var dataTest = { content: 'testPublicChatVoice'};
            Message.findOne(dataTest, function(err, messages) {
              Message.find({_id:messages._id}).remove().exec();
            }).catch(err => console.log(err));
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });   
  });

  test('Should post announcements voice message successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=ESNAdmin')
      .send('password=undefinedYWRtaW4=')
      .end(function (err, res) {
        agent.post(HOST + '/messages/announcements')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(400);
          });
        agent.post(HOST + '/messages/announcements')
          .send('username=xinyanw')
          .send('isVoice=true')
          .send('content=testAnnouncementsVoice')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            var dataTest = { content: 'testAnnouncementsVoice'};
            Message.findOne(dataTest, function(err, messages) {
              recallId = messages._id;
              Message.find({_id:messages._id}).remove().exec();
            });
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });   
  });

  test('Should recall public voice message successfully', function (done) {
    agent.post(HOST + '/users/login')
      .set('Token', 'text/plain')
      .set('content-type', 'application/x-www-form-urlencoded')
      .type('form')
      .send('grant_type=password')
      .send('username=xinyanw')
      .send('password=undefinedMTIzNA==')
      .end(function (err, res) {
        agent.post(HOST + '/voice/recall')
          .send('id=5a9b1ad1b6cb8b577beace67')
          .set('x-access-token', res.body.token)
          .end(function (err, res) {
            expect(res.statusCode).to.be.equal(200);
          });
        done();
      });   
  });
})
