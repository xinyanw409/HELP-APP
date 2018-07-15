'use strict';

//this is a specification for socket event name
module.exports = {
    chatPrivate: "chat private",
    chatPublic: "chat public",
    historyMsg: "history message",
    userLogin: "user login",
    userLogout: "user logout",
    disconnect: "disconnect",
    status: "status",
    updateStatus: "update status",
    announcement: "announcement",
    activity: "activity",
    updateActivity: "update activity",
    updateAnnouncement: "update announcement",
    announcementVoice: "announcementVoice",
    publicVoice: "publicVoice",
    voice: "voice",
    all: "all",
    map: "map",
    //get unread messages' author
    unread: "unread",
    //used to tell all clients when user profile has been updated
    updateProfile: "update profile",
    checkLogin: "check login",
    combine: function(...arr) {
        return arr.join("+");
    }
}