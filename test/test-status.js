let expect = require('chai').expect;
let agent = require('superagent');
var status 		= require('../models/status');

suite('STATUS TESTS: ', function () {

    test('Status works', function (done) {
        expect(status.get("ok")).to.be.eq(1);
        expect(status.get("help")).to.be.eq(2);
        expect(status.get("emergency")).to.be.eq(3);
        expect(status.get("undefined")).to.be.eq(4);
        done();
    });
  })

