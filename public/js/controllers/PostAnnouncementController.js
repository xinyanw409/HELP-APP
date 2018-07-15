"use strict";

import events from '../events.js'
import ClientSocket from '../ClientSocket.js'
import {contentToSrc} from '../HelperVoice.js'
var SocketService = ClientSocket.socket;

angular.module("help")
.controller("PostAnnouncementController", function($rootScope, $scope, $http, $location, $window) {
/*-------------------------------------------------*/
/* INITIALIZE CONTROLLER */
/*-------------------------------------------------*/  
    (function initController() {
        // reset chat status
        $scope.showPostAnnouncement = false;
        $rootScope.showNavi = true;
        $rootScope.showVoice = false;
        $rootScope.newMsgArrive = false;
        $rootScope.alertNewMsg = true;
        $rootScope.n = 10;
        $rootScope.canSearch = true;
        $rootScope.isSearch = false;
        $rootScope.currentUser = $window.sessionStorage.username;
        $rootScope.canPostAnnouncement = $window.sessionStorage.privilege && $window.sessionStorage.privilege > 0;
        console.log("current user is !! : " + $window.sessionStorage.username);
    })();
/*-------------------------------------------------*/
/* POST ANNOUNCEMENT */
/*-------------------------------------------------*/

    // Get new announcements
    $rootScope.getAnnouncements = function(){
        $http.get('/messages/announcements').then(function(response) {
            $rootScope.announcements = response.data;
            console.log($rootScope.announcements);
            for (var i=0; i < $rootScope.announcements.length; i++) {
                var message = $rootScope.announcements[i];
                if (message.isVoice) {
                    console.log("message.content is ");
                    console.log(message.content);
                    message.isvoice = 'true';
                    message.src = contentToSrc(message.content);
                } else {
                    message.isvoice = 'false';
                    message.src = null;
                }
            }
        },function (error){
            ClientSocket.handleError(error, ()=>{$location.url('/login');});
        });
    };

    $scope.showPostAnnouncementAct = () => {
        $scope.showPostAnnouncement = true;
    }

    var postAnnounceMsg = (content) => {
        $http.post('/messages/announcements', content).then(function(response) {
            
        },function (error){
            alert(error.data.message);
        });
    }

    $scope.announce = {};
    $scope.sendAnnouncement = () => {
        var content = $scope.announce.announcementContent;
        postAnnounceMsg({content: content});
        $scope.showPostAnnouncement = false;
    };

    $scope.cancelPost = () => {
        $scope.showPostAnnouncement = false;
    }
    // voice
    $scope.recordVoice = () => {
        $rootScope.showVoice = !$rootScope.showVoice;
        $scope.showPostAnnouncement = false;
    };
    $scope.sendAnnouncementVoice = () => {
        var content = document.getElementById("voice_input").value;
        var data = {content: content, isVoice: 'true'};
        postAnnounceMsg(data);
        $rootScope.showVoice = false;
        
    };
    $scope.deleteVoice = (id) => {
        console.log("come to delete voice ")
        console.log("id is " + id)
        var data = {
            id: id
        }
        $http.post('/voice/recall/', data).then(function(response) {
            
        },function (error){
            alert(error)
            console.log(error, 'can not get data.');
        });
        document.getElementById(id).hidden = true;
    };

    SocketService.on(events.combine(events.all, events.announcement), function(data) {
        console.log("get new announcement");
        if ($rootScope.isSearch) {
            return;
        }
        $rootScope.getAnnouncements();
    });
/*-------------------------------------------------*/
/* INITIALIZE HOMEPAGE */
/*-------------------------------------------------*/
    $rootScope.getAnnouncements();

});