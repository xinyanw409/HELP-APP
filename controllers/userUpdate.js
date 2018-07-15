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

var getUsers = (req, res, next) => {
  //only administrator can see the inactive user
  console.log(req.username);
  User.findOne({username: req.username}, function(err, user) {
    var filter = {};   
    if(user && user.privilege !== 2) {
      filter.isActive = 1;
    }
    async.parallel({
        user_list: function(callback) {
          User.find(filter)
          .collation({locale:'en', strength: 2})
          .sort({username: 1})
          .exec(callback);
        },
        msg_list: function(callback) {
          Message.find({target: req.username, unread: 1}).exec(callback);
        }
      }, function(err, results) {
        if (err) { return next(err); };
        return res.status(200).json({ user_list: results.user_list, msg_list: results.msg_list});
      });
  });
}

var updateStatus = (req, res, next) => {
  var myusername = req.username;
  var status = req.body.lastStatusCode;
  if(!status) return res.status(400).send({ message : 'status required'});
  var lastStatusCode = parseInt(status);
  User.findOne({username: myusername}, function(err, user) {
    if(err) {return next(err);}
    if(user) {
      user.lastStatusCode = lastStatusCode;
      user.save();
      var socketio = req.app.get('socketio');
      socketio.emit(Event.combine(Event.all, Event.status), {otherusername: myusername, lastStatusCode: lastStatusCode});
      return res.status(200).send({message: 'update success'});
    }
    else
      return res.status(404).send({message: 'user not found'});
    });
}

var updatePosition = (req, res, next) => {
  var myusername = req.username;
  var lat = req.body.lat;
  var lng = req.body.lng;
  if (!lat || !lng) return res.status(400).send({ message : 'coordinates required'});
  var latitude = lat.toString();
  var longitude = lng.toString();
  User.findOne({username: myusername}, function(err, user) {
    if (err) {return next(err);}
    if (user) {
      var socketio = req.app.get('socketio');
      socketio.emit(Event.combine(Event.all, Event.map), {username: myusername, latitude: latitude, longitude: longitude, accountStatus: 1});
      user.latitude = latitude;
      user.longitude = longitude;
      user.save();
      return res.status(200).send({message: 'update position success'});
    } else {
      return res.status(404).send({message: 'user not found'});
    }
  });
}

module.exports = { 
    getUsers,
    updateStatus,
    updatePosition
};