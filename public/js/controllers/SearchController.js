"use strict";

import events from '../events.js'
import ClientSocket from '../ClientSocket.js'
import statusIcons from '../statusIcons.js'
var SocketService = ClientSocket.socket;

var stopWords = ['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among', 'an', 'and', 'any', 
    'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 
    'either', 'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'he', 'her', 'hers', 
    'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'least', 'let', 'like', 
    'likely', 'may', 'me', 'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off', 'often', 
    'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say', 'says', 'she', 'should', 'since', 'so', 
    'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to', 'too', 
    'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 
    'will', 'with', 'would', 'yet', 'you', 'your'];

/*-------------------------------------------------*/
/* GLOBAL VARIABLES */
/*-------------------------------------------------*/
var processQuery = function(initquery) {
    var escapedQuery = xssEscape(initquery);
    var query = escapedQuery;
    query = query.trim();
    var words = query.split(" ");
    words = words.filter(ele => stopWords.indexOf(ele) < 0);
    query = words.join(" ");
    return query;
}

var showAlert = function(message) {
    iziToast.show({
        icon: 'icon-style',
        title: 'Not Found',
        message: message,
        transitionIn: 'fadeInDown',
        transitionInMobile: 'fadeInDown',
        position: 'center'
    });
}

angular.module("help")
.controller("SearchController", function($rootScope, $scope, $location, $http, $window) {
/*-------------------------------------------------*/
/* INITIALIZE CONTROLLER */
/*-------------------------------------------------*/
    (function initController() {
        // reset chat status
        $rootScope.newMsgArrive = false;
        $rootScope.alertNewMsg = false;
        $rootScope.n = 10;
        $rootScope.canSearch = true;
        $scope.searchContent = 'Search';

    })();  

    var processError = (error) => {
        if (error.status == 403 || error.status == 500) {
            $location.url('/login');
        } else {
            alert(error.data.message); 
        }
    } 
/*-------------------------------------------------*/
/* SEARCH */
/*-------------------------------------------------*/

    var getUriForSearchPrivate = function(query) {
        $rootScope.showPrivateChat = false;
        $rootScope.privateDest = null;
        $rootScope.privateMsgs = [];
        if (query.length === 0) {
            $rootScope.searchResult = undefined;
            $rootScope.noSearchResult = true;
            showAlert('No Such Private Chat');
            return;
        }
        var escapedQuery = xssEscape(query);
        var uri = "/messages/privateMessages/" + escapedQuery;
        return uri;
    }

    var searchPrivateChat = function(query) {
        var uri = getUriForSearchPrivate(query);
        if (!uri) return;
        $http.get(uri).then(function(response) {
            var results = response.data;
            $rootScope.searchResult = results;
            if (results.length === 0) {
                $rootScope.noSearchResult = true;
                showAlert('No Such Private Chat');
                return;
            }
            for (var i=0; i < $rootScope.searchResult.length; i++) {
                var message = $rootScope.searchResult[i];
                message.statusIcon = statusIcons[message.lastStatusCode];
            }
            
        },function (error){
            processError(error);
        });
    }

    var getUriForSearchAnnounce = function(query) {
        if (query.length === 0) {
            $rootScope.announcements = undefined;
            $rootScope.noSearchResult = true;
            showAlert('No Such Announcement');
            return;
        }
        var escapedQuery = xssEscape(query);
        var uri = "/messages/announcements/" + escapedQuery;
        return uri;
    }

    var searchAnnouncement = function(query) {
        var uri = getUriForSearchAnnounce(query);
        if (!uri) return;
        $http.get(uri).then(function(response) {
            var results = response.data;
            $rootScope.announcements = results;
            if (results.length === 0) {
                $rootScope.noSearchResult = true;
                showAlert('No Such Announcement');
                return;
            }
        },function (error){
            if (error.status == 403 || error.status == 500) {
                $location.url('/login');
            } else {
                processError(error);
            }
        });
    }

    var getUriForSearchPublic = function(query) {
        if (query.length === 0) {
            $rootScope.messages = undefined;
            $rootScope.noSearchResult = true;
            showAlert('No Such Public Chat');
            return;
        }
        var escapedQuery = xssEscape(query);
        var uri = "/messages/publicMessages/" + escapedQuery;
        return uri;
    }

    var searchPublicChat = function(query) {
        var uri = getUriForSearchPublic(query);
        if (!uri) return;
        $http.get(uri).then(function(response) {
            $rootScope.messages = response.data;
            if (response.data.length === 0) {
                $rootScope.noSearchResult = true;
                showAlert('No Such Public Chat');
                return;
            }
            for (var i=0; i < $rootScope.messages.length; i++) {
                var message = $rootScope.messages[i];
                message.statusIcon = statusIcons[message.lastStatusCode];
            }
        
        },function (error){
            processError(error);
        });
    }

    $scope.searchQuery = {};
    $scope.search = () => {
        $rootScope.n = 10;
        $rootScope.noSearchResult = false;
        var query = $scope.searchQuery.query;
        query = processQuery(query);
        $rootScope.isSearch = true;

        var url = $location.url();
        console.log(url);
        switch(url) {
            case "/chatPrivate": 
                searchPrivateChat(query);
                break;
            case "/announcement": 
                searchAnnouncement(query);
                break;
            case "/chatPublic": 
                searchPublicChat(query);
                break;
        }
        $scope.searchQuery.query = "";
    }

    $rootScope.moreSearchResult = () => {
        $rootScope.n = $rootScope.n + 10;
    }

});