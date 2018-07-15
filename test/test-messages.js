let expect = require('chai').expect;
let agent = require('superagent');
let Message = require('../models/message');
let User = require('../models/user');

let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

var config 		= require('../configs/config');
var mongoose 	= require('mongoose');
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

suite('Message Model TESTS: ', function () {
  setup(function () {
    mongoose.connect(dbURI, {
      useMongoClient: true
    });
  });

  Message.find({_id:'5a9b1ad1b6cb8b577beace78'}).remove().exec();
  User.find({username:'testUser2'}).remove().exec();

  test('Can create a new message', function (done) {
    var data = { _id: "5a9b1ad1b6cb8b577beace78", content: "testCase1", author: "testUser2", 
    messageType: 1, __v: 0, postDate: "2018-03-03T21:59:45.676Z"};
    var new_message = null;
    try{
      new_message = Message.create(data);
    } catch(e) {

    }
    expect(new_message).to.not.be.null;
    done();
  });

  test('Can find one exact message', function (done) {
    var dataTest = { _id: '5ae0d95321edf9001401c10d', content: "Hello", author: "ESNAdmin", 
    messageType: 1, __v: 0, postDate: "2018-04-25T19:38:59.553Z"};
    Message.findOne(dataTest, function(err, messages) {
          expect(String(messages)).to.deep.include(dataTest._id);
          done();
      }).catch(err => console.log(err));
    process.on('unhandledRejection', err => {
      throw err;
    });
  });

  test('Can find by id successfully', function (done) {
    var id = { _id: '5ae0d95321edf9001401c10d'};
    Message.findById(mongoose.Types.ObjectId(id._id), function(err, messages) {
          expect(String(messages)).to.deep.include(id._id);
          done();
      });
  });

  test('Can update successfully', function (done) {
    var src = { _id: '5ae0d96721edf9001401c10e', content: "Announcement", author: "ESNAdmin", 
    messageType: 3, __v: 0, postDate: "2018-04-25T19:39:19.824Z"};
    var change = { _id: '5ae0d96721edf9001401c10e', content: "Announcement", author: "ESNAdmin", 
    messageType: 3, __v: 0, postDate: "2018-04-25T19:39:19.824Z"};
    Message.update(src, change, function(err, messages) {
          expect(messages.n).to.be.equal(1);
          done();
      });
  });

})
