const User = require('../models/user');
const Message = require('../models/message');
const Activity = require('../models/activity');
const async = require('async');
const config = require('../configs/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Event = require('../socket/event');
const saltRounds = 10;
//the token will expire in 2 hours
const expireTime = 7200;
var updateActivity = (req, obj, msg) => {
    Activity.find().exec(function(err, activities) {
        activities.forEach(function(activity) {
            var attendees = activity.attendees;
            var newAttendees = [];
            attendees.forEach(function(attendee) {
                if(attendee !== obj.oldusername) {
                    newAttendees.push(attendee);
                }
                else if(obj.isActive !== 0){
                    if(obj.newusername !== undefined)
                        newAttendees.push(obj.newusername);
                    else {
                        newAttendees.push(obj.oldusername);
                    }
                }
            });
            if(obj.isActive === 0)
                activity.spots++;
            activity.attendees = newAttendees;
            activity.save();
        });
        var socketio = req.app.get('socketio');    
        //tell clients whose profile has beeen changed
        socketio.emit(Event.combine(Event.all, Event.updateProfile), {msg: msg, oldusername: obj.oldusername});
    })
}
//update all oldusername in message and activity to be new username
var updateMsg = (req, obj, myMsg) => {
    if(obj.newusername !== undefined) {
        Message.find({author: obj.oldusername}).exec(function(err, messages) {
            messages.forEach(function(msg) {
                msg.author = obj.newusername;
                msg.save();
            });
            Message.find({target: obj.oldusername}).exec(function(err, messages) {
                messages.forEach(function(msg) {
                    msg.target = obj.newusername;
                    msg.save();
                });
                updateActivity(req, obj, myMsg);
            })
        })
    }
    else {
        updateActivity(req, obj, myMsg);
    }
}
var update = (req, res, obj, user) => {
    if(obj.newusername) user.username = obj.newusername;
    var hashedPassword;
    if(obj.password) {
        hashedPassword = bcrypt.hashSync(obj.password, saltRounds);
        user.password = hashedPassword;
    }
    if(obj.isActive !== undefined) user.isActive = obj.isActive;
    user.save();
    var msg = user;
    updateMsg(req, obj, msg);
    return res.status(200).send({message: 'update success'});
}
var checkUnique = (req, res, obj, user) => {
    if(obj.privilege !== undefined && user.privilege === 2 && obj.privilege !== 2) {
        User.find({privilege: 2, isActive: 1}, function(err, users){
            if(users && users.length === 1) {
                return res.status(400).send({message: 'there must be at least one administrator'}); 
            }
            user.privilege = obj.privilege;
            update(req, res, obj, user);
        })
    }
    else {
        if(obj.privilege !== undefined)
            user.privilege = obj.privilege;
        update(req, res, obj, user); 
    } 
}
var checkAdministrator = (req, res, obj) => {
    User.findOne({username: obj.oldusername}, function(err, user) {
        if(user) {
            if(user.privilege === 2 && obj.isActive === 0) {
                User.find({privilege: 2, isActive: 1}, function(err, users){
                    if(users && users.length === 1) {
                        return res.status(400).send({message: 'there must be at least one active administrator'}); 
                    }
                    checkUnique(req, res, obj, user);
                })
            }
            else {
                checkUnique(req, res, obj, user);
            }
        }
        else {
            return res.status(404).send({message: 'user not found'});
        }
    })
}
var checkUsername = (req, res, obj) => {
    User.findOne({username: obj.newusername}, function(err, user) {
        if(user) return res.status(400).send({message: 'username already exist'});   
        checkAdministrator(req, res, obj);
    });
}
var checkPrivilege = (req, res, obj) => {
    User.findOne({username: req.username}, function(err, user) {
        if(user.privilege !== 2) {
            return res.status(400).send({message: 'you do not have the privilege'});
        }
        checkUsername(req, res, obj);
    })
}
var updateProfile = (req, res, next) => {
    var obj = {};
    obj.oldusername = req.body.oldusername;
    obj.newusername = req.body.newusername;
    obj.password = req.body.password;
    obj.privilege = req.body.privilege;
    obj.isActive = req.body.isActive;
    if(obj.privilege) obj.privilege = parseInt(obj.privilege);
    if(obj.isActive) obj.isActive = parseInt(obj.isActive);
    checkPrivilege(req, res, obj);
  }
  module.exports = { 
      updateProfile
  };
