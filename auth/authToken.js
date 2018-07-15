const config = require('../configs/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Event = require('../socket/event');

//middleware
function authToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if(!token) {
        return res.status(403).send({auth: 0, message: 'No token provided.'});
    }
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if(err) {
            return res.status(500).send({auth: 0, message: 'fail to authenticate token'});
        }
        User.findOne({username: decoded.username}, function(err, user) {
            if(!user) return res.status(404).send({auth: 0, message: 'user not found'});
            if(user.accountStatus === 2) {
                user.accountStatus = 1;
                user.save();
                var socketio = req.app.get('socketio');
                socketio.emit(Event.combine(Event.all, Event.userLogin), {msg: user});
            }
            req.userid = decoded.userid;
            req.username = decoded.username;
            next();
        })
    })
}

module.exports = authToken;