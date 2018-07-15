
"use strict";

var events = {

    chatPrivate: "chat private",
    chatPublic: "chat public",
    publicVoice: "publicVoice",
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
    updateProfile: "update profile",
    announcementVoice: "announcementVoice",
    voice: "voice",
    all: "all",
    unread: "unread",
    map: "map",

    combine: function(...str) {
        return str.join("+");
    }

};

export default events;