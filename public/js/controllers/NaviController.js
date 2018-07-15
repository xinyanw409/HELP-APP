import events from '../events.js'
import ClientSocket from '../ClientSocket.js'
import statusIcons from '../statusIcons.js'
var SocketService = ClientSocket.socket;

angular.module("help")
.controller("NaviController", function($rootScope, $scope, $location, $http, $window) {
/*-------------------------------------------------*/
/* INITIALIZE CONTROLLER */
/*-------------------------------------------------*/
    (function initController() {
        // reset chat status
        $rootScope.newMsgArrive = false;
        $rootScope.alertNewMsg = false;
    })();  

/*-------------------------------------------------*/
/* USER LOGOUT */
/*-------------------------------------------------*/

    $scope.logout = () => {
        SocketService.emit(events.userLogout, {myusername: $window.sessionStorage.username});
        delete $window.sessionStorage.token;
        $window.sessionStorage.username = undefined;
        $window.sessionStorage.privilege = undefined;
        
    }
    // Get new activities
    $scope.updateActivities = function() {
        $rootScope.canSearch = false;
        $rootScope.noSearchResult = false;
        $rootScope.isSearch = false;
        $rootScope.alertNewMsg = true;
        $rootScope.privateDest = null;
    }
    // Get new announcements
    $scope.updateAnnouncements = function() {
        $rootScope.canSearch = true;
        $rootScope.noSearchResult = false;
        $rootScope.isSearch = false;
        $rootScope.alertNewMsg = true;
        $rootScope.privateDest = null;
        $scope.searchContent = 'Search announcements';
        if ($rootScope.getAnnouncements) {
            $rootScope.getAnnouncements();
        }
    };
    // Get new public chat message
    $scope.updatePublicWall = () => {
        $rootScope.canSearch = true;
        $rootScope.noSearchResult = false;
        $rootScope.alertNewMsg = true;
        $rootScope.isSearch = false;
        $rootScope.privateDest = null;
        $scope.searchContent = 'Search public chats';
        SocketService.emit('history message+chat public', {myusername: $window.sessionStorage.username});
        if ($rootScope.getPublicMsg) {
            $rootScope.getPublicMsg();
        }
    }
    // Get user list
    $rootScope.updateUserList = function() {
        $rootScope.canSearch = true;
        $rootScope.noSearchResult = false;
        $rootScope.noSearchUserResult = false;
        $rootScope.alertNewMsg = false;
        $rootScope.isSearch = false;
        $rootScope.privateDest = null;
        $scope.searchContent = 'Search private chats';
        if ($rootScope.getUserList) {
            $rootScope.getUserList();
        }
    }

    $scope.gotoShareStatus = () => {
        $rootScope.canSearch = false;
        $rootScope.privateDest = null;
    }
/*-------------------------------------------------*/
/* NEW PRIVATE MESSAGE */
/*-------------------------------------------------*/
    SocketService.on(events.combine($window.sessionStorage.username, events.chatPrivate), function(data) {
        console.log('new private msg');
        console.log(data.msg);
        $rootScope.newMsgArrive = true;
        $scope.$apply();
    });

    SocketService.on(events.combine($window.sessionStorage.username, events.voice), function(data) {
        $rootScope.newMsgArrive = true;
        $scope.$apply();
    });

    $scope.checkPrivateMsg = () => {
        $rootScope.newMsgArrive = false;
        $scope.searchContent = 'Search private chats';
        $location.url('/chatPrivate');
    }
/*-------------------------------------------------*/
/* USER PROFILE UPDATE */
/*-------------------------------------------------*/
    SocketService.on(events.combine(events.all, events.updateProfile), function(data) {
        console.log('update profile');
        var user = data.msg;
        var oldusername = data.oldusername;
        if (oldusername == $window.sessionStorage.username) {
            if (user.isActive === 0 || user.username != oldusername) {
                alert("You are logged out because your account is set inactive or your username is changed.");
                $scope.logout();
                $location.url('/login');
            }
            $window.sessionStorage.privilege = user.privilege;
            $rootScope.isAdmin = ($window.sessionStorage.privilege > 1);
            $rootScope.canPostAnnouncement = ($window.sessionStorage.privilege > 0);
        }
        if ($rootScope.getUserList) {
            $rootScope.getUserList();
        }
        if ($rootScope.getPublicMsg) {
            $rootScope.getPublicMsg();
        }
        if ($rootScope.getAnnouncements) {
            $rootScope.getAnnouncements();
        }
        if ($rootScope.updateActivities) {
            $rootScope.updateActivities();
        }
        $scope.$apply();
    });

});

