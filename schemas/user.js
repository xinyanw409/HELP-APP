'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: {type: String, unique: true, trim: true, required: true, max: 50},
    password: {type: String, select: false},
    createDate: {type: Date, default: Date.now},
    updateDate: {type: Date, default: Date.now},
    lastLoginDate: {type: Date, default: Date.now},
    //1: GREEN 2: YELLOW 3: RED 4: undefined
    lastStatusCode: {type: Number, default: 4},
    //1: ACTIVE 2: INACTIVE (whether login or logout)
    accountStatus: {type: Number, default: 2},
    email: {type: String, default: ""},
    latitude: {type: String, default: "40.44"},
    longitude: {type: String, default: "-79.99"},
    socketId: {type: String, default: ""},
    //0: Citizen 1: Coordinator 2: Administrator
    privilege: {type: Number, default: 0},
    //0: inactive 1: active (the status of account)
    isActive: {type: Number, default: 1},
}, { autoIndex: false });

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);