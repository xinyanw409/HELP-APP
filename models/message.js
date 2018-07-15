'use strict';
var userModel = require('../schemas/user');
var messageModel = require('../schemas/message');

module.exports = class {
    static create(data, callback){
        var newMessage = new messageModel(data);
        newMessage.save(callback);
        return newMessage;
    }

    static update(src, change, callback){
        messageModel.update(src, change, callback);
    }

    static findById(id, callback){
        messageModel.findById(id, callback);
    }

    static find(data, callback){
        return messageModel.find(data, callback);
    }

    static findOne(data, callback){
        return messageModel.findOne(data, callback);
    }
};
