const User = require('../models/user');
const Message = require('../models/message');
const Event = require('../socket/event');
const packageWords = require('./regex');
const Help = require('./messageHelp');

var searchAnnoun = (req, res, next) => {
    var t = req.params.text;
    var regex = packageWords(t);
    Message.find({content: new RegExp("(" + regex + ")" +'.*$', "i"), messageType: 3, isVoice: false}).sort({ postDate: -1 }).exec(
      function(err, messages) {
        Help.filter(res, messages);
    });
    return res.status(400);
}

var searchHelp = (type, req, res) => {
    var t = req.params.text;
    var regex = packageWords(t);
    Message.find({content: new RegExp("(" + regex + ")" +'.*$', "i"), messageType: type, isVoice: false}).sort({ postDate: -1 }).exec(
      function(err, messages) {
        Help.filter(res, messages);
    });
}

var searchPrivate = (req, res, next) => {
    searchHelp(2, req, res);
}

var searchPublic = (req, res, next) => {
    searchHelp(1, req, res);
}

module.exports = { 
    searchAnnoun, 
    searchPrivate, 
    searchPublic 
};