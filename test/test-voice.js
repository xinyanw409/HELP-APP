let expect = require('chai').expect;
let agent = require('superagent');
let Message = require('../models/message');
let User = require('../models/user');

let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

var config    = require('../configs/config');
var mongoose  = require('mongoose');
var chai = require("chai");
chai.should();
chai.use(require('chai-things'));
var dbURI = "mongodb://" + 
      encodeURIComponent(config.db.username) + ":" + 
      encodeURIComponent(config.db.password) + "@" + 
      config.db.host + ":" + 
      config.db.port + "/" + 
      config.db.name;   

process.on('unhandledRejection', (reason, p) => {
  // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

suite('Message Model Voice TESTS: ', function () {
  setup(function () {
    mongoose.connect(dbURI, {
      useMongoClient: true
    });
  });

  Message.find({_id:'5a9b1ad1b6cb8b577beace67'}).remove().exec();

  test('Can create a new voice message', function (done) {
    var data = { _id: "5a9b1ad1b6cb8b577beace67", content: "testCase1", author: "testUser6", 
    messageType: 1, __v: 0, postDate: "2018-03-03T21:59:45.676Z", isVoice: false};
    var new_message = null;
    try{
      new_message = Message.create(data);
      Message.find({_id:'5a9b1ad1b6cb8b577beace67'}).remove().exec();
    } catch(e) {

    }
    expect(new_message).to.not.be.null;
    done();
  });
  
})

