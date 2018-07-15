"use strict";

import events from '../events.js'
import ClientSocket from '../ClientSocket.js'
var SocketService = ClientSocket.socket;

angular.module("help")
.controller("ShareStatusController", function($rootScope, $scope, $location, $http) {
/*-------------------------------------------------*/
/* INITIALIZE CONTROLLER */
/*-------------------------------------------------*/
    (function initController() {
        // reset chat status
        $rootScope.showNavi = true;
        $rootScope.showVoice = false;
        $rootScope.alertNewMsg = true;
        $rootScope.newMsgArrive = false;
        $rootScope.canSearch = false;
    })();
/*-------------------------------------------------*/
/* GLOBAL VARIABLES */
/*-------------------------------------------------*/
    $scope.statusExplanation = {
        1: 'I am OK, I do not need help.', 
        2: 'I need help, but this is not a life threatening emergency.', 
        3: 'I need help now, as this is a life threatening emergency!',
    }
/*-------------------------------------------------*/
/* SHARE STATUS */
/*-------------------------------------------------*/
    $scope.status = {}
    $scope.postStatus = () => {
        var status = $scope.status.name;
        var data = {
            lastStatusCode: status,
        };
        $http.post('/users/status', data).then(function(response) {
            $rootScope.canSearch = true;
            $location.url('/chatPrivate');
        },function (error){
            ClientSocket.handleError(error, ()=>{$location.url('/login');});
        });
       
    }
});