const User = require('../models/user');
const Message = require('../models/message');
const async = require('async');
const config = require('../configs/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Event = require('../socket/event');
const saltRounds = 10;
//the token will expire in 2 hours
const expireTime = 7200;
var filterHelp = (req, res, filter) => {
    //only administrator can see the inactive user
    User.findOne({username: req.username}, function(err, user) {
      if(user && user.privilege !== 2) {
        filter.isActive = 1;
      }
      User.find(filter, function(err, msg) {
        datamsg = msg;
        return res.status(200).send(datamsg);
      });
    })
}
var searchUsername = (req, res, next) => {
    var u = req.params.username;
    if(!u) return res.status(400).send({ message : 'username required'});
    var inputContent = u.trim();
    var datamsg;
    var filter = {username: new RegExp(inputContent+'.*$', "i")};
    filterHelp(req, res, filter);
}
var searchStatus = (req, res, next) => {
    var t = req.params.statusCode;
    // if(!t) return res.status(400).send({ message : 'status required'});
    var inputContent = t.trim().toLowerCase();
    var code = 4;
    switch(inputContent) {
        case "ok":
          code = 1;
          break;
        case "help":
          code = 2;
          break;
        case "emergency":
          code = 3;
          break;
        case "undefined":
          code = 4;
          break;
    }
    var datamsg;
    var filter = {lastStatusCode: code};
    filterHelp(req, res, filter);
}
module.exports = { 
	searchUsername, 
	searchStatus
};