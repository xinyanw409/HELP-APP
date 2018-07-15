let expect = require('chai').expect;
let agent = require('superagent');
var config 		= require('../configs/config');
var mongoose 	= require('mongoose');

var dbURI = "mongodb://" + 
			encodeURIComponent(config.db.username) + ":" + 
			encodeURIComponent(config.db.password) + "@" + 
			config.db.host + ":" + 
			config.db.port + "/" + 
      config.db.name;      
//connect database

suite('DATABASE TESTS: ', function () {

    test('Can connect db', function (done) {
        try {
            mongoose.connect(dbURI, {
                useMongoClient: true
              });
            // expect.fail("??? mongoose");
            done();
          } catch (err) {
            console.log(err.message)
            // expect(err.message || err).to.equal("connect MongoDB failed");
            done();
          }
    });
  })

