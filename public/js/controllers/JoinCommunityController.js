"use strict";

import {Base64} from '../lib/encrypt.js';
import statusIcons from '../statusIcons.js'
import events from '../events.js'
import ClientSocket from '../ClientSocket.js'
import reservedUsername from '../reservedUsername.js'
var SocketService = ClientSocket.socket;

angular.module("help")
.controller("JoinCommunityController", function($rootScope, $scope, $location, $http, $window) {

    (function initController() {
            // reset login status
            $rootScope.showNavi = false;
            $rootScope.showVoice = false;
            $scope.usernameInvalid = false;
            $scope.passwordInvalid = false;
            $scope.wrongPassword = false;
            $scope.myUsername = $rootScope.regUsername;
            $scope.myPassword = $rootScope.regPassword;
    })();

    $scope.$watch('username', function(value) {
        $scope.wrongPassword = false;
        if(value != undefined && (value.length < 3 || reservedUsername.includes(value))) {
            $scope.usernameInvalid = true;
        } else {
            $scope.usernameInvalid = false;
        }
    });

    $scope.$watch('password', function(value) {
        $scope.wrongPassword = false;
        if(value != undefined && value.length < 4) {
            $scope.passwordInvalid = true;
        } else {
            $scope.passwordInvalid = false;
        }
    });

    $scope.$watch('confirmPass', function(value) {
        if(value != $scope.myPassword) {
            $scope.confirmPassInvalid = true;
        } else {
            $scope.confirmPassInvalid = false;
        }
        
    });

    $scope.login = function (){
        var username = $scope.username;
        var password = $scope.password;
        $rootScope.regUsername = username;
        $rootScope.regPassword = password;
        if(!$scope.usernameInvalid && !$scope.passwordInvalid) {
            var data = {
                'username': username,
                'password': Base64.encode(password),
            };
            $http.post('/users/login', data).then(function(response) {
                $window.sessionStorage.username = username;
                if (response.data.auth == 1) {
                    SocketService.emit(events.userLogin, {myusername: username});
                    $window.sessionStorage.token = response.data.token;
                    $window.sessionStorage.privilege = response.data.privilege;
                    $location.url('/chatPrivate');
                } else if (response.data.auth == 0) {
                    $location.url('/register');
                } else if (response.data.auth == 2) {
                    alert("Your account is inactive. Please contact administrator for more information.")
                }
            },function (error){
                delete $window.sessionStorage.token;
                $scope.wrongPassword = true;
            });
        }
    }

    $scope.register = function () {
        var confirm_password = $scope.confirmPass;
        console.log("encode: " + Base64.encode($scope.myPassword));
        if(!$scope.usernameInvalid && !$scope.passwordInvalid && !$scope.confirmPassInvalid) {
            var data = {
                'username': $scope.myUsername,
                'password': Base64.encode($scope.myPassword),
                'confirm_password': Base64.encode(confirm_password)
            };
            $http.post('/users', data).then(function(response) {
                SocketService.emit(events.userLogin, {myusername: $scope.myUsername});
                $window.sessionStorage.token = response.data.token;
                $window.sessionStorage.privilege = response.data.privilege;
                $location.url('/welcome'); 
            },function (error){
                delete $window.sessionStorage.token;
                alert(error.message)
            });
        }
        
    }


});




    // Base64 encoding service used by AuthenticationService
