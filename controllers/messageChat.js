const User = require('../models/user');
const Message = require('../models/message');
const Event = require('../socket/event');
const Help = require('./messageHelp');
var annHelp = (res, type) => {
  Message.find({messageType: type}).sort('-postDate').exec(function(err, messages) {
    if(err) {return next(err);}
    Help.filter(res, messages);
  });
}
var getAnnoun = (req, res, next) => {
  annHelp(res, 3);
}
var getPublicHistory = (req, res, next) => {
  annHelp(res, 1);
}

var filterPara = (isVoice, filter) => {
  if(isVoice)
    filter.isVoice = true;
  else
    filter.isVoice = false;
}
var postAnnoun = (req, res, next) => {
  var c = req.body.content;
  if(!c) return res.status(400).send({ message : 'content required'});
  var content = c.trim();
  var filter = {content: content, author: req.username, messageType: 3};
  filterPara(req.body.isVoice, filter);
  User.findById(req.userid, function(err, user) {
      if(user.privilege === 0) {
        return res.status(400).send({ message : 'you do not have the privilege'});
      }
      Message.create(filter, function(err, message) {
      var socketio = req.app.get('socketio');
      socketio.emit(Event.combine(Event.all, Event.announcement), {msg: message });
      return res.status(200).send({message: 'post successful'});
      });
  });
}
var postPublic = (req, res, next) => {
  var myusername = req.username;
  var content = req.body.content;
  if(!content) return res.status(400).send({ message : 'content required'});
  User.findOne({username: myusername}, function(err, user) {
      var filter= {content: content, author: myusername, messageType: 1, lastStatusCode: user.lastStatusCode};
      filterPara(req.body.isVoice, filter);
      Message.create(filter, function(err, msg) {
          var socketio = req.app.get('socketio');
          socketio.emit(Event.combine(Event.all, Event.chatPublic), {msg: msg});
          res.status(200).send({message: 'post successful'});
      })
  })
}
var postPrivate = (req, res, next) => {     
  var myusername = req.username;   
  var otherusername = req.body.otherusername;
  var content = req.body.content;
  var check = otherusername && content;
  if(!check) return res.status(400).send({ message : 'content required'});
  User.findOne({username: myusername}, function(err, user) {
      if(err) {return next(err);}
      var filter = {content: content, author: myusername, target: otherusername, messageType: 2, lastStatusCode: user.lastStatusCode};
      filterPara(req.body.isVoice, filter);
      Message.create(filter, function(err, msg) {
          if(err) {return next(err);}
          var socketio = req.app.get('socketio');
          socketio.emit(Event.combine(otherusername, Event.chatPrivate), {msg: msg});
          return res.status(200).send({message: 'post successful'});
      })
  })
}
var getPrivateHistory = (req, res, next) => {
  var myusername = req.username;
  var otherusername = req.params.username;
  if(!otherusername) return res.status(400).send({ message : 'other username required'});
  Message.find({
      $or: [{author: myusername, target: otherusername, messageType: 2},
      {author: otherusername, target: myusername, messageType: 2}]
  }).sort('postDate')
  .exec(function(err, msg) {
    if(err) {return next(err);}
    for(var i = 0; i < msg.length; i++) {
      Message.findById(msg[i]._id, function(err, ms) {
          ms.unread = 0;
          ms.save();
      })
    }
    return res.status(200).send({msg: msg});
  })
}
module.exports = { 
  postAnnoun,
  getAnnoun, 
  postPublic,
  postPrivate,
  getPublicHistory,
  getPrivateHistory
};