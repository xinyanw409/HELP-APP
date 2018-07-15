"use strict";

import events from '../events.js'
import ClientSocket from '../ClientSocket.js'
var SocketService = ClientSocket.socket;

angular.module("help")
.controller("ActivityController", function($rootScope, $location, $scope, $http, $window) {
/*-------------------------------------------------*/
/* INITIALIZE CONTROLLER */
/*-------------------------------------------------*/  
    (function initController() {
        // reset chat status
        $rootScope.showNavi = true;
        $rootScope.newMsgArrive = false;
        $rootScope.alertNewMsg = true;
        $rootScope.n = 10;
        $rootScope.canSearch = false;
        $rootScope.isSearch = false;
        $rootScope.canPostAnnouncement = $window.sessionStorage.privilege && $window.sessionStorage.privilege > 0;
    })();

    var invalidStyle = {
        "border-color": "#fc626a",
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
/*-------------------------------------------------*/
/* POST ACTIVITY */
/*-------------------------------------------------*/
    // Get new ACTIVITY
    $rootScope.updateActivities = function(){
        $scope.activityDict = {};
        $scope.activities = [];
        $http.get('/activities').then(function(response) {
            var acts = response.data;
            for (var i = 0; i < acts.length; i++) {
                var activity = acts[i];
                var isRegistered;
                var index = activity.attendees.indexOf($window.sessionStorage.username);
                var participants = activity.attendees.join(', ');
                if (index == -1) isRegistered = false;
                else isRegistered = true;
                var saveActivity = {
                    title: activity.title,
                    location: activity.location,
                    startDate: activity.startDate,
                    endDate: activity.endDate,
                    spots: activity.spots,
                    description: activity.description,
                    isRegistered: isRegistered,
                    showDetails: false,
                    participants: participants,
                };
                $scope.activityDict[activity.title] = saveActivity;
                $scope.activities.push(activity.title);
            }
        },function (error){
            ClientSocket.handleError(error, ()=>{$location.url('/login');});
        });
    };

    $scope.showPostActivityForm = () => {
        $location.url('/activityForm');
    }

    $scope.showDetailsAct = (title) => {
        $scope.activityDict[title].showDetails = !$scope.activityDict[title].showDetails;
    }

    var post = (url, data) => {
        $http.post(url, data).then(function(response) {
            
        },function (error){
            alert(error.data.message);
        });
    }

    $scope.activityForm = {};

    var checkForm = () => {
        $scope.descInvalid = $scope.activityForm.description ? undefined : invalidStyle;
        $scope.spotInvalid = ($scope.activityForm.spots && $scope.activityForm.spots > 0) ? undefined : invalidStyle;
        $scope.locationInvalid = $scope.activityForm.location ? undefined : invalidStyle;
        $scope.titleInvalid = $scope.activityForm.title ? undefined : invalidStyle;
        var start = ($scope.ctrl == undefined || $scope.ctrl.startDate == undefined);
        var end = ($scope.ctrl == undefined || $scope.ctrl.endDate == undefined);
        $scope.startInvalid = !start ? undefined : invalidStyle;
        $scope.endInvalid = !end ? undefined : invalidStyle;
        if (!start && !end) {
            if ($scope.ctrl.endDate._d < $scope.ctrl.startDate._d 
                || $scope.ctrl.endDate._d < new Date()) {
                $scope.endInvalid = invalidStyle;
                $scope.wrongEnd = true;
            } else {
                $scope.endInvalid = undefined;
                $scope.wrongEnd = false;
            }
        }

        if ($scope.descInvalid || $scope.spotInvalid || $scope.locationInvalid 
            || $scope.titleInvalid || $scope.startInvalid || $scope.endInvalid) {
            return false;
        } else {
            return true;
        }
    }

    $scope.postActivity = () => {
        
        if (!checkForm()) return;
        var title = $scope.activityForm.title;
        if ($scope.activityDict[title]) {
            $scope.titleInvalid = invalidStyle;
        } else {
            $scope.titleInvalid = {};
        }
        var data = {
            title: title,
            location: $scope.activityForm.location,
            startDate: $scope.ctrl.startDate._d,
            endDate: $scope.ctrl.endDate._d,
            spots: $scope.activityForm.spots,
            description: $scope.activityForm.description,
        };
        post('/activities', data);
        $location.url('/activity');
    };

    $scope.registerActivity = () => {
        var email = $scope.activityForm.email;
        var title = $scope.registerTitle;
        if (!validateEmail(email)) {
            $scope.emailInvalid = invalidStyle;
            return;
        }
        var data = {
            email: email,
            title: title,
        };
        $http.post('/activities/register', data).then(function(response) {
            if (response.data.spot) {
                $scope.noSpots = true;
            } 
            $scope.showRegisterActivity = false;
            $scope.emailInvalid = {};
        },function (error){
            alert(error.data.message);
        });
    }

    $scope.cancel = () => {
        $location.url('/activity');
    }

    $scope.cancelRegister = () => {
        $scope.showRegisterActivity = false;
        $scope.emailInvalid = {};
    }

    $scope.showRegisterPost = (title) => {
        if ($scope.activityDict[title].spots < 1) {
            $scope.noSpots = true;
        } else {
            $scope.showRegisterActivity = !$scope.showRegisterActivity;
            $scope.registerTitle = title;
        }
    }

    $scope.closeAlert = () => {
        $scope.noSpots = false;
    }

    $scope.UnregisterPost = (title) => {
        post('/activities/unregister', {title: title});
    }

    SocketService.on(events.combine(events.all, events.activity), function(data) {
        console.log("get new activity");
        $rootScope.updateActivities();
    });

    SocketService.on(events.combine(events.all, events.updateActivity), function(data) {
        console.log("register activity");
        $rootScope.updateActivities();
    });
/*-------------------------------------------------*/
/* INITIALIZE HOMEPAGE */
/*-------------------------------------------------*/
    $rootScope.updateActivities();

});