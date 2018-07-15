'use strict';

const User = require('../models/user');
const Message = require('../models/message');
const Event = require('./event');

var login = (io, socket) => {
    socket.on(Event.userLogin, function(msg) {
        var username = msg.myusername;
        var check = username;
        if(!check) return;
        User.findOne({username: username}).exec(function(err, user) {
            if(!user) return;
            user.socketId = socket.id;
            user.save();
            io.emit(Event.combine(Event.all, Event.userLogin), {msg: user});
            Message.find({target: username, unread: 1}).exec(function(err, msg) {
                io.emit(Event.combine(username, Event.unread), {msg: msg});
            })
        })
    })
}

var offlineHelp = (io, user) => {
    if(!user) return;
    user.accountStatus = 2;
    user.save();
    io.emit(Event.combine(Event.all, Event.userLogout), {msg: user}); 
}

var logout = (io, socket) => {
    socket.on(Event.userLogout, function (msg) {
        var username = msg.myusername;
        var check = username;
        if(!check) return;
        User.findOne({username: username}).exec(function(err, user) {
            offlineHelp(io, user);
        });
    })
}

var disconnect = (io, socket) => {
    socket.on(Event.disconnect, function (msg) {
        User.findOne({socketId: socket.id}).exec(function(err, user) {
            offlineHelp(io, user);
        });
    })
}

var events = function(io) {
    io.on('connection', (socket) => {
        login(io, socket);
        logout(io, socket);
        disconnect(io, socket);
    })
};

var init = function(app) {
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    events(io);
    app.set('socketio', io);
	return http;
};

module.exports = init;
