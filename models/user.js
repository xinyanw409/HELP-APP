'use strict';
var userModel = require('../schemas/user');
var messageModel = require('../schemas/message');

module.exports = class {
    static register(user, data, callback){
        userModel.register(user, data, callback);
    }

    static create(data, callback){
        var newUser = new userModel(data);
        newUser.save(callback);
        return newUser;
    }

    static update(src, change, callback){
        userModel.update(src, change, callback);
    }

    static findById(id, callback){
        userModel.findById(id, callback);
    }

    static find(data, callback){
        return userModel.find(data, callback);
    }

    static findOne(data, callback){
        return userModel.findOne(data, callback);
    }

    //administrator username
    static administrator() {
        return "ESNAdmin";
    }
};
