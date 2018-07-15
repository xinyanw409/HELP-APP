'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

// const DEFAULT_AVATAR_URL = '/images/avatar_default.jpg';

var MessageSchema = new Schema({
    content: {type: String, required: true, max: 30000},
    postDate: {type: Date, default: Date.now},
    author: { type: String, required: true, max: 200, trim: true},
    isVoice: {type: Boolean, default: false},
    //User of the target if message is a chat message sent to another user
    //if public, no need for target
    // target: { type: Schema.ObjectId, ref: 'User'},
    target: { type: String, max: 200, trim: true},
    //1: PUBLIC 2: PRIVATE 3: Announcement
    messageType: {type: Number},
    //0: read 1: unread, used only for private message
    unread: {type: Number, default: 1},

    lastStatusCode: {type: Number, default: 4},
    isVoice: {type: Boolean, default: false},

}, { autoIndex: false });

module.exports = mongoose.model('Message', MessageSchema);