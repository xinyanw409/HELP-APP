"use strict";

import events from '../events.js'
import ClientSocket from '../ClientSocket.js'
var SocketService = ClientSocket.socket;

angular.module("help")
.controller("MapController", function($rootScope, $scope, NgMap, $http, $window) {
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCWh1SZwtAgJH5c_CuwyDPj9PHIB3ha9ck";
    $scope.show = false;
    $rootScope.isMap = true;
    var lat = 40.44;
    var lng = -79.99;
    var map;
    var mark;
    var usersMap = {};
    var userList = {};
    var showMarker = false;
    var interval;

    (function initController() {
        // Get map instance
        NgMap.getMap().then(function(m) {
            map = m;
            var labelname = $window.sessionStorage.username;
            mark = new google.maps.Marker({
                label: {
                    text: labelname
                }
            });
        });

        // Initialize user map when enter
        $http.get('/users').then(function(response) {
            userList = response.data.user_list;
            updateUserMap(userList);
        },function (error){
            alert("Invalid position information!")
        });

        interval = setInterval(function() {
            if ($rootScope.isMap) {
                updatePosition(getLocation());
                var data = {
                    lat: lat,
                    lng: lng,
                };
                $http.post('/users/position', data).then(function(response) {
                    
                },function (error){
                    clearInterval(interval);
                });
            }
        }, 10000);
    })();

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updatePosition);
        }
        return null;
    };

    function updatePosition(position) {
        if (position) {
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        }
    };

    function currentLocation() {
        return {lat:lat, lng:lng};
    };

    function updateUser(username, data) {
        if (usersMap[username]) {
            usersMap[username].lat = data.latitude;
            usersMap[username].lng = data.longitude;
            usersMap[username].accountStatus =  1;
        } else {
            usersMap[username] = {
                username: username,
                accountStatus: data.accountStatus,
                lat: data.latitude,
                lng: data.longitude,
                marker: new google.maps.Marker({
                    label: {
                        text: username
                    }
                })
            }
        }
    }

    function updateUserMap(userList) {
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            updateUser(user.username, user);
        }
    }

    $scope.showCurrentPos = () => {
        var redraw = function(payload) {
            lat = payload.message.lat;
            lng = payload.message.lng;

            map.setCenter({lat:lat, lng:lng, alt:0});
            mark.setPosition({lat:lat, lng:lng, alt:0});
            mark.setMap(map);
        };
        var pnChannel = "map2-channel";

        var pubnub = new PubNub({
            publishKey:   'pub-c-9dcba02a-0bbd-4f2e-947c-fbdd68760003',
            subscribeKey: 'sub-c-babbcdf8-3b70-11e8-b20a-be401e5b340a'
        });

        pubnub.subscribe({channels: [pnChannel]});
        pubnub.addListener({message:redraw});

        setInterval(function() {
            pubnub.publish({channel:pnChannel, message:currentLocation()});
        }, 5000);

    }

    $scope.showNeighbor = () => {
        showMarker = true;
        var min = null;
        var dist;
        var username;
        for (var key in usersMap) {
            if (key == $window.sessionStorage.username) {
                continue;
            }
            if (usersMap[key].accountStatus == 1) {
                usersMap[key].marker.setPosition({lat:parseFloat(usersMap[key].lat), lng:parseFloat(usersMap[key].lng), alt:0});
                usersMap[key].marker.setMap(map);
                var path = [mark.getPosition(), usersMap[key].marker.getPosition()];
                dist = google.maps.geometry.spherical.computeDistanceBetween(path[0], path[1]);
                if (min == null || dist < min) {
                    min = dist;
                    username = usersMap[key].username;
                    continue;
                }
            }
        }
        $scope.username = username;
        $scope.dist = min.toFixed(2);
        $scope.show = true;
    }

    SocketService.on(events.combine(events.all, events.map), function(data) {
        if (data.username != $window.sessionStorage.username) {
            var username = data.username;
            updateUser(username, data);
            if (showMarker) {
                usersMap[username].marker.setPosition({lat:parseFloat(usersMap[username].lat), lng:parseFloat(usersMap[username].lng), alt:0});
                usersMap[username].marker.setMap(map);
            }
        }
    });
});
