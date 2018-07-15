let expect = require('chai').expect;
let agent = require('superagent');
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

suite('User Model TESTS: ', function () {
  setup(function () {
    mongoose.connect(dbURI, {
      useMongoClient: true
    });
  });

  test('Can register a new user', function (done) {
    User.find({username:'testUser'}).remove().exec();
    User.register(User.create({ username : "testUser"}), "testPassword", 
        function(err, user) {
            if(user != null) {
              console.log(user.username);
                expect(user.username).to.be.eq("testUser");
            }
            done(); 
        }
    );
  });

  test('Can find a exact user by findOne', function (done) {
    User.findOne({username: "xinyanw"},
        function(err, user) {
            if(user.length == 1) {
                expect(user.username).to.be.eq("xinyanw");
            }
          }
    );
    done();
  });
  
  test('Can retrive user by id', function (done) {
    User.findById({_id: "5adfdbaf9feb000014a5af97"},
        function(err, user) {
            if(user != null) {
                expect(user.username).to.be.eq("xinyanw");
            }
          }
    );
    done();
  });

})
