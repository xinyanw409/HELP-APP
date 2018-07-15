const User = require('../models/user');
const Message = require('../models/message');
const async = require('async');
const config = require('../configs/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Event = require('../socket/event');
const saltRounds = 10;
const expireTime = 7200;
User.findOne({username: "ESNAdmin"}, function(err, user) {
  if(!user) {
    User.create({
      username: "ESNAdmin",
      password: bcrypt.hashSync("undefinedYWRtaW4=", saltRounds),
      privilege: 2,
      lastStatusCode: 1
    })
  }
  else {
    user.privilege = 2;
    user.lastStatusCode = 1;
    user.isActive = 1;
    user.password = bcrypt.hashSync("undefinedYWRtaW4=", saltRounds);
    user.save();
  }
});
var updateHelp = (user, res, next) => {
  var token = jwt.sign({userid: user._id, username: user.username}, config.jwtSecret, {
    expiresIn: expireTime
  });
  User.update({username: user.username}, {
    accountStatus: 1
  }, function(err) {
  if(err) return next(err);
  return res.status(200).send({auth: 1, token: token, privilege: user.privilege});
  });
}
var register = (req, res, next) => {
    var u = req.body.username;
    var p = req.body.password;
    var c = req.body.confirm_password;
    var paraCheck = u && p && c;
    if(!paraCheck)  return res.status(400).send({ message : 'no required parameters'});
    var username = u.trim();
    var password = p.trim();
    var confirm_password = c.trim();
    if(password !== confirm_password) {
      return res.status(400).send({ message : 'two password not match', auth: 0 });
    }
    User.findOne({username: username}, function(err, u) {
      if(u) return res.status(400).send({message: "register fail, username exists", toggle: false});
      var hashedPassword = bcrypt.hashSync(password, saltRounds);
      User.create({
        username: username,
        password: hashedPassword
      },
      function(err, user) {
        if(err) {
          return res.status(400).send({message: "register fail, check your username", toggle: false});
        }
        updateHelp(user, res, next);
      });
    })
}
var login = (req, res, next) => {
    var u = req.body.username;
    var p = req.body.password;
    var paraCheck = u && p;
    if(!paraCheck)  return res.status(400).send({ message : 'username or password required'});
    var username = u.trim();
    var password = p.trim();
    User.findOne({username: username}).select('+password').exec(function(err, user) {
      if(err) return res.status(500).send({message: "problem with server"});
      if(!user) {
        return res.status(200).send({auth: 0, message: "username not exist"});
      }
      if(user.isActive === 0) {
        return res.status(200).send({auth: 2, message: "you are inactive"});
      }
      var checkPassword = bcrypt.compareSync(password, user.password);
      if(!checkPassword) {
        return res.status(401).send({message: "password is wrong", auth: 0, token: null});
      }
      updateHelp(user, res, next);
    });
}
module.exports = { 
  register, 
    login
};