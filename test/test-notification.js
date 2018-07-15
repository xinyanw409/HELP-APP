let expect = require('chai').expect;
let agent = require('superagent');
var request = require('supertest');
let Email = require('../controllers/emailNotification');

let PORT = 3002;
let HOST = 'http://localhost:' + PORT;

suite('NOTIFICATION TESTS: ', function () {
  test('Should generate email content successfully', function (done) {
    var username = 'xinyanw';
    var activity = {
        title:'Test notification',
        description: 'Generate email content',
        startDate: '2018-04-13 11:15:34',
        location: 'HH'
    }
    var content = Email.generateEmailContent(activity, username);
    expect(content).to.deep.include(activity.location);
    done();
  });

  test('Should send email successfully', function (done) {
    var email = 'email@email.com';
    var username = 'xinyanw';
    var activity = {
        title:'Test notification',
        description: 'Generate email content',
        startDate: '2018-04-13 11:15:34',
        location: 'HH'
    }
    var content = Email.generateEmailContent(activity, username);
    var title = 'Hello';
    err = Email.sendEmail(email, content, title);
    expect(err).to.equal(undefined);
    done();
  });

})

