
'use strict';

var app = angular.module("help", ["ui.router", "moment-picker", "ngMap"]);

app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        console.log($window.sessionStorage.token);
        config.headers['x-access-token'] = $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
	.state('login', {url: '/login', templateUrl: '../templates/login.html', controller: "JoinCommunityController"})
	.state('register', {url: '/register', templateUrl: '../templates/register.html', controller: "JoinCommunityController"})
        .state('welcome', {url: '/welcome', templateUrl: '../templates/welcome.html'})
	.state('chatPublic', {url: '/chatPublic', templateUrl: '../templates/chatPublic.html', controller: "chatPublicController"})
        .state('chatPrivate', {url: '/chatPrivate', templateUrl: '../templates/chatPrivate.html', controller: "ChatPrivateController"})
        .state('announcement', {url: '/announcement', templateUrl: '../templates/announcement.html',controller: "PostAnnouncementController"})
        .state('status', {url: '/status',templateUrl: '../templates/status.html',controller: "ShareStatusController"})
        .state('activity', {url: '/activity',templateUrl: '../templates/activity.html',controller: "ActivityController"})
        .state('activityForm', {url: '/activityForm',templateUrl: '../templates/activityForm.html',controller: "ActivityController"})
        .state('profile', {url: '/profile',templateUrl: '../templates/profile.html',controller: "ProfileController"})
        .state('map', {url: '/map',templateUrl: '../templates/map.html',controller: 'MapController'});
    $urlRouterProvider.otherwise("login");

    $httpProvider.interceptors.push('authInterceptor');
});


