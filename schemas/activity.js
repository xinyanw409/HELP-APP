'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

var ActivitySchema = new Schema({
    title: {type: String, required: true, max: 200, trim: true},
    location: {type: String, required: true, max: 200, trim: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    description: { type: String, max: 500, trim: true},
    //0: read 1: unread, used only for private message
    spots: {type: Number, default: 0},
    attendees: {type: Array, default: []},
    postDate: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Activity', ActivitySchema);