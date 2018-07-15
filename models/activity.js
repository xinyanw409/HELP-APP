'use strict';
var userModel = require('../schemas/user');
var activityModel = require('../schemas/activity');

module.exports = class {
    static create(data, callback){
        var newActivity = new activityModel(data);
        newActivity.save(callback);
        return newActivity;
    }

    static update(src, change, callback){
        activityModel.update(src, change, callback);
    }

    static findById(id, callback){
        activityModel.findById(id, callback);
    }

    static find(data, callback){
        return activityModel.find(data, callback);
    }

    static findOne(data, callback){
        return activityModel.findOne(data, callback);
    }
};