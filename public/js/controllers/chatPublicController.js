"use strict";

import events from '../events.js'
import ClientSocket from '../ClientSocket.js'
import {contentToSrc} from '../HelperVoice.js';
import statusIcons from '../statusIcons.js'
var SocketService = ClientSocket.socket;
/*-------------------------------------------------*/
/* GLOBAL VARIABLES */
/*-------------------------------------------------*/

angular.module("help")
.controller("chatPublicController", function($rootScope, $scope, $http, $window, $location) {
    console.log("chat here");
/*-------------------------------------------------*/
/* INITIALIZE CONTROLLER */
/*-------------------------------------------------*/
    (function initController() {
            // reset chat status
            $scope.showPost = false;
            $rootScope.showNavi = true;
            $rootScope.showVoice = false;
            $rootScope.newMsgArrive = false;
            $rootScope.alertNewMsg = true;
            $rootScope.n = 10;
            $rootScope.canSearch = true;
            $rootScope.isSearch = false;
            $rootScope.messages = [];
            $rootScope.currentUser = $window.sessionStorage.username;
    })();
/*-------------------------------------------------*/
/* INITIALIZE HOMEPAGE */
/*-------------------------------------------------*/

    // Get all public messages
    $rootScope.getPublicMsg = function(){
      $http.get('/messages/publicHistory').then(function(response) {
          $rootScope.messages = response.data;

          for (var i=0; i < $rootScope.messages.length; i++) {
              var message = $rootScope.messages[i];
              if (message.isVoice) {
                  message.isvoice = 'true';
                  message.src = contentToSrc(message.content);
              }
            message.statusIcon = statusIcons[message.lastStatusCode];
        }
    },function (error){
        ClientSocket.handleError(error, ()=>{$location.url('/login');});
    });
}
$rootScope.getPublicMsg();

/*-------------------------------------------------*/
/* CHAT PUBLICLY */
/*-------------------------------------------------*/
    // Get new public message
    SocketService.on(events.combine(events.all, events.chatPublic), function(data) {
        if ($rootScope.isSearch) {
            return;
        }
        $rootScope.getPublicMsg();
    });

    var postPublicMsg = (content) => {
        $http.post('/messages/publicMessages', content).then(function(response) {
            
        },function (error){
            alert(error.data.message);
        });
    }
    $scope.public = {};
    $scope.sendPublicMsg = () => {
        var content = $scope.public.content;
        postPublicMsg({content: content});
        $scope.showPost = false;
        console.log($rootScope.messages);
    };
    // Show window for public chat
    $scope.postMsg = () => {
        $scope.showPost = true;
    };
    $scope.cancelPost = () => {
        $scope.showPost = false;
    }
   // voice
   $scope.recordVoice = () => {
        $rootScope.showVoice = !$rootScope.showVoice;
        $scope.showPost = false;
    };

    $scope.sendPublicVoice = () => {
        var content = document.getElementById("voice_input").value;
        var data = {content: content, isVoice: 'true'};
        postPublicMsg(data);
        $rootScope.showVoice = false;
    };
    $scope.deleteVoice = (id) => {
        $http.post('/voice/recall/', {id: id}).then(function(response) {
            
        },function (error){
            alert(error.data.message);
            console.log(error);
        });
        document.getElementById(id).hidden = true;
    };

});
