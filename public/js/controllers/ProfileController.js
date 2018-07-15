import {Base64} from '../lib/encrypt.js';
import reservedUsername from '../reservedUsername.js'

angular.module("help")
.controller("ProfileController", function($rootScope, $location, $scope, $http) {
     (function initController() {
        // reset chat status
        $rootScope.showNavi = true;
        $rootScope.newMsgArrive = false;
        $rootScope.alertNewMsg = true;
        $rootScope.canSearch = false;
        $rootScope.isSearch = false;

    })();

    var invalidStyle = {
        "border-color": "#fc626a",
    }

    $scope.profile = {
        oldusername: $rootScope.profileUser,
    };

    var checkProfile = () => {
        var username = $scope.profile.newusername;
        var password = $scope.profile.newpassword;
        if ((username != undefined && username.length < 3) || reservedUsername.includes(username)) {
            $scope.usernameInvalid = invalidStyle;
        } else {
            $scope.usernameInvalid = undefined;
        }
        if (password != undefined && password.length < 4) {
            $scope.passwordInvalid = invalidStyle;
        } else {
            $scope.passwordInvalid = undefined;
        }
        if ($scope.passwordInvalid != undefined || $scope.usernameInvalid != undefined) {
            return true;
        } else {
            return false;
        }
        
    }

    $scope.postProfile = () => {
        if (checkProfile()) return;
        var username = $scope.profile.newusername;
        var password = $scope.profile.newpassword;
        var privilege = $scope.profile.privilege;
        var isActive = $scope.profile.isActive;
        var data = {
            oldusername: $scope.profile.oldusername,
        }
        if (username) { data.newusername = username };
        if (password) { data.password = Base64.encode(password) };
        if (privilege) { data.privilege = privilege };
        if (isActive) { data.isActive = isActive };
        console.log("oldusername: " + data.oldusername);
        $http.put('/users/profiles', data).then(function(response) {
            $location.url('/chatPrivate');
        },function (error){
            alert(error.data.message);
        });
    }

    $scope.cancel = () => {
        $location.url('/chatPrivate');
        $rootScope.profileUser = undefined;
    }

});
