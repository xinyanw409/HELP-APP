"use strict";

import statusIcons from '../statusIcons.js'
import events from '../events.js'
import ClientSocket from '../ClientSocket.js'
import {contentToSrc} from '../HelperVoice.js';
var SocketService = ClientSocket.socket;

/*-------------------------------------------------*/
/* GLOBAL VARIABLES */
/*-------------------------------------------------*/
var statusName = {
    1: 'OK', 
    2: 'HELP', 
    3: 'EMERGENCY',
    4: 'UNDEFINED',
}

angular.module("help")
.controller("ChatPrivateController", function($rootScope, $scope, $http, $location, $window) {
/*-------------------------------------------------*/
/* INITIALIZE CONTROLLER */
/*-------------------------------------------------*/
    (function initController() {
        // reset chat status
        $rootScope.showNavi = true;
        $rootScope.showVoice = false;
        $rootScope.showPrivateChat = false;
        $rootScope.newMsgArrive = false;
        $rootScope.alertNewMsg = false;
        $rootScope.isSearch = false;
        $scope.isSearchUser = false;
        $scope.moreThanOneWord = false;
        $rootScope.noSearchUserResult = false;
        $rootScope.canSearch = true;
        $rootScope.isAdmin = $window.sessionStorage.privilege && $window.sessionStorage.privilege > 1;
    })();    
/*-------------------------------------------------*/
/* USER LIST */
/*-------------------------------------------------*/
    var setHasNewMsg = (messageList) => {
        for (var i=0; i < messageList.length; i++) {
            var msg = messageList[i];
            $rootScope.users[msg.author].hasNewMsg = true;
        }
    }

    $rootScope.refreshUserList = function(userList, messageList) {
        console.log(userList);
        $rootScope.users = {};
        for (var i=0; i < userList.length; i++) {
            var user = userList[i];
            if ($rootScope.users[user.username]) {
                $rootScope.users[user.username].statusIcon = statusIcons[user.lastStatusCode];
            } else {
                $rootScope.users[user.username] = {
                    username: user.username,
                    status: user.lastStatusCode,
                    statusIcon: statusIcons[user.lastStatusCode],
                    hasNewMsg: false,
                    accountStatus: user.accountStatus,
                    isActive: user.isActive,
                }
            }
        }
        if (messageList) setHasNewMsg(messageList);
    }

    $rootScope.getUserList = function() {
        $http.get('/users').then(function(response) {
            var userList = response.data.user_list;
            var messageList = response.data.msg_list;
            $rootScope.refreshUserList(userList, messageList);
        },function (error){
            ClientSocket.handleError(error, ()=>{$location.url('/login');});
        });
    }
    // Get users with unread messages
    SocketService.on(events.combine($window.sessionStorage.username, events.unread), function(data) {
        var msgs = data.msg;
        setHasNewMsg(msgs);
        $scope.$apply();
    });
    // Someone log in 
    SocketService.on(events.combine(events.all, events.userLogin), function(msg) {
        if ($scope.isSearchUser || msg.msg.username == $window.sessionStorage.username) {
            return;
        }
        $rootScope.getUserList();
    });
    // Someone log out
    SocketService.on(events.combine(events.all, events.userLogout), function(user) {
        console.log("log out " + user.msg.username);
        $rootScope.users[user.msg.username].accountStatus = 2;
        $scope.$apply();
    });

    SocketService.on(events.combine(events.all, events.status), function(data) {
        if ($rootScope.users[data.otherusername]) {
            $rootScope.getUserList();
        }
    });

    $scope.editProfile = (username) => {
        $rootScope.profileUser = username;
        $location.url('/profile');
    }

    $scope.search = {};
    $scope.showSearchUser = () => {
        $scope.showSearch = true;
        $scope.search.content = "";
        $scope.moreThanOneWord = false;
    }

    var getUriForSearchUser = function() {
        $rootScope.noSearchUserResult = false;
        var query = $scope.search.content;
        query = query.trim();
        var length = query.split(" ").length;
        if (length !== 1 || query.length === 0) {
            $scope.moreThanOneWord = true;
            return;
        }
        $scope.isSearchUser = true;
        $scope.moreThanOneWord = false;

        if (query == 'OK' || query == 'Help' || query == 'Emergency') {
            var uri = '/users/status/' + query;
        } else {
            var uri = '/users/username/' + query;
        }
        return uri;
    }

    $scope.cancelSearch = () => {
        $scope.showSearch = false;
    }

    $scope.searchUser = () => {
        var uri = getUriForSearchUser();
        if (!uri) return;
        $http.get(uri).then(function(response) {
            var userList = response.data;
            if (userList.length === 0) {
                $rootScope.noSearchUserResult = true;
                iziToast.show({
                    imageWidth: 100,
                    image: 'images/avatar.jpg',
                    color: 'dark',
                    icon: 'icon-person',
                    title: 'Not Found User',
                    message: 'No Such User',
                    position: 'bottomRight',
                    layout: 2
                });
            } else {
                $rootScope.refreshUserList(userList);
            }
            $scope.showSearch = false;
        },function (error){
            alert(response.message);
        });
    }
/*-------------------------------------------------*/
/* CHAT PRIVATELY */
/*-------------------------------------------------*/
    // Get history private message
    $scope.privateMsgs = []
    // Draw private message to chat window
    var addPrivateMsg = function(msg) {
        var message = {
            side: msg.side,
            content: msg.content,
            postDate: msg.postDate,
            isvoice: msg.isVoice,
            src: msg.src,
            statusIcon: statusName[msg.lastStatusCode]
        }
        $scope.privateMsgs.push(message);
    }

    // Emit request for history message
    var getHistoryMsg = function(dest) {
        var source = $window.sessionStorage.username;
        var uri = '/messages/privateHistory/' + dest;
        
        $http.get(uri).then(function(response) {
            console.log($window.sessionStorage.username);
            $scope.privateMsgs = response.data.msg;
            var source = $window.sessionStorage.username;
            for (var i=0; i < $scope.privateMsgs.length; i++) {
                var message = $scope.privateMsgs[i];
                if (message.author == source) {
                    message.side = 'right';
                } else {
                    message.side = 'left';
                }
                if (message.isVoice) {
                    message.isvoice = 'true';
                    var src = contentToSrc(message.content);
                    message.src = src;
                } else {
                    message.isvoice = 'false';
                }
                message.statusIcon = statusName[message.lastStatusCode];
            }
            // $scope.$apply();
        },function (error){
            alert(error.message);
        });
    }

    // Receive private message
    SocketService.on(events.combine($window.sessionStorage.username, events.chatPrivate), function(data) {
        var msg = data.msg;
        var destUser = msg.author;
        var content = msg.content;
        var postDate = msg.postDate;
        var isVoice = msg.isVoice;
        var src = undefined;
        if (destUser == $rootScope.privateDest) {
            if (isVoice) {
                src = contentToSrc(content);
            }
            var msg = {content: content, isVoice: isVoice, src: src, side: 'left', postDate: postDate, lastStatusCode: msg.lastStatusCode}
            addPrivateMsg(msg);
        } else {
            $rootScope.users[destUser].hasNewMsg = true;
        }
        $scope.$apply();
       
    });
    // Show private chat window
    $scope.chatPrivate = (username) => {
        if (username == $window.sessionStorage.username) return;
        $rootScope.privateDest = username;
        $rootScope.showPrivateChat = true;
        $rootScope.users[username].hasNewMsg = false;
        $rootScope.isSearch = false;
        getHistoryMsg(username);
    };

    var postPrivateMsg = (content, isVoice) => {
        var dest = $rootScope.privateDest;
        var data = {
            content: content,
            otherusername: dest
        }
        if (isVoice) data.isVoice = 'true';
        console.log('post private message');
        $http.post('/messages/privateMessages', data).then(function(response) {
            
        },function (error){
            alert(error.data.message);
        });
    }

    var generateMsg = (content, src, isVoice) => {
        var username = $window.sessionStorage.username;
        var msg = {content: content, isVoice: isVoice, src: src, side: 'right', postDate: new Date().toLocaleString(), lastStatusCode: $rootScope.users[username].status}
        return msg;
    }
    // Send private message
    $scope.private = {};
    $scope.sendPrivateMsg = () => {
        var username = $window.sessionStorage.username;
        var content = $scope.private.input;
        var msg = generateMsg(content, undefined, 'false');
        addPrivateMsg(msg); 
        $scope.private.input = "";
        postPrivateMsg(content, false);
    };

    $scope.closePrivateChat = () => {
        $rootScope.showPrivateChat = false;
        $rootScope.privateDest = null;
        $rootScope.privateMsgs = [];
    };

    $rootScope.getUserList();

    // voice
    $scope.recordVoice = () => {
        $rootScope.showVoice = !$rootScope.showVoice;
    };

    $scope.sendVoice = () => {
        var username = $window.sessionStorage.username;
        var content = document.getElementById("voice_input").value;
        postPrivateMsg(content, true);
        var src = contentToSrc(content);
        var btnSendRecording = document.getElementById("btn-send-recording");
        btnSendRecording.disabled = true;
        var msg = generateMsg(undefined, src, 'true');
        addPrivateMsg(msg);
        $rootScope.showVoice = false;
        
    };
});
