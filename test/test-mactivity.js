let expect = require('chai').expect;
let agent = require('superagent');
let Activity = require('../models/activity')
let User = require('../models/user');


let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

var config    = require('../configs/config');
var mongoose  = require('mongoose');
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

suite('Activity Model TESTS: ', function () {
  setup(function () {
    mongoose.connect(dbURI, {
      useMongoClient: true
    });
  });

  Activity.find({_id:'5acd45d955e454e1bc72fd77'}).remove().exec();

  test('Can create a new activity', function (done) {
    var data = { 
      _id: "5acd45d955e454e1bc72fd77", 
      title: "testTitle1", 
      location: "testLocation",
      startDate: "2018-02-01T11:30:00.991Z",
      endDate: "2018-03-06T14:00:00.009Z",
      description: "Description",
      __v: 0,
      spots: 30, 
      postDate: "2018-03-03T21:59:45.676Z",
      attendees:[],
    };
    var new_activity = null;
    try{
      new_activity = Activity.create(data);
    } catch(e) {

    }
    expect(new_activity).to.not.be.null;
    done();
  });

  test('Can find one exact activity', function (done) {
    var data = { 
      _id: "5ae0d8aa21edf9001401c10c", 
      title: "Admintest", 
      location: "HH",
      startDate: "2018-07-25T18:30:45.631Z",
      endDate: "2018-07-26T18:10:45.639Z",
      description: "test",
      postDate: "2018-04-25T19:36:10.924Z",
      attendees:[],
    };
    Activity.findOne(data, function(err, activities) {
          expect(String(activities)).to.deep.include(data._id);
          done();
      }).catch(err => console.log(err));
    process.on('unhandledRejection', err => {
      throw err;
    });
  });

  test('Can find by id successfully', function (done) {
    var id = { _id: '5ae0d8aa21edf9001401c10c'};
    Activity.findById(mongoose.Types.ObjectId(id._id), function(err, activities) {
          expect(String(activities)).to.deep.include(id._id);
          done();
      });
  });

  test('Can update successfully', function (done) {
    var src = { 
      _id: "5acd45d955e454e1bc72fd77", 
      title: "testTitle1", 
      location: "testLocation",
      startDate: "2018-02-01T11:30:00.991Z",
      endDate: "2018-03-06T14:00:00.009Z",
      description: "Description",
      __v: 0,
      spots: 30, 
      postDate: "2018-03-03T21:59:45.676Z",
      attendees:[],
    };
    var update = { 
      _id: "5acd45d955e454e1bc72fd77", 
      title: "testTitle1", 
      location: "testLocation",
      startDate: "2018-02-01T11:30:00.991Z",
      endDate: "2018-03-06T14:00:00.009Z",
      description: "Description",
      __v: 0,
      spots: 30, 
      postDate: "2018-03-03T21:59:45.676Z",
      attendees:[],
    };
    Activity.update(src, update, function(err, activities) {
          expect(activities.n).to.be.equal(1);
          done();
      });
  });

})