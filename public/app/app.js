'use strict';

//var api_url = "http://104.236.225.92:3200";
var api_url = "http://localhost:3200";

var app = angular.module('udla', ['ngRoute', 'route-segment', 'view-segment', 'ngMaterial', 'satellizer']);

app.config(['$routeSegmentProvider', '$routeProvider', '$mdThemingProvider', '$authProvider',
    function($routeSegmentProvider, $routeProvider, $mdThemingProvider, $authProvider) {
        $authProvider.loginUrl = api_url + '/login';
        $authProvider.tokenName = 'token';
        $authProvider.tokenPrefix = '';
        $authProvider.storageType = 'localStorage';

        $routeSegmentProvider.

        when('/', 'main').
        when('/news', 'main.news').
        when('/events', 'main.events').
        when('/admin', 'main.admin').
        when('/login', 'login').

        segment('main', {
            abstract: true,
            templateUrl: 'app/main/view_main.html',
            controller: 'mainCtrl'
        }).

        within().

        segment('news', {
            templateUrl: 'app/news/view_news.html',
            controller: 'newsCtrl'
        }).

        segment('events', {
            templateUrl: 'app/events/view_events.html',
            controller: 'eventsCtrl'
        }).

        segment('admin', {
            templateUrl: 'app/user/signIn/view_signIn.html',
            controller: 'signInCtrl'
        }).
        
        up().

        segment('login', {
            templateUrl: 'app/user/login/view_login.html',
            controller: 'loginCtrl'
        });


        $routeProvider.otherwise({
            redirectTo: '/news'
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('teal')
            .accentPalette('cyan');

    }
    
]).controller('appCtrl', function($scope, $mdDialog) {

    $scope.showAlert = function(ev, title, content, callback) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(content)
            .ariaLabel('error')
            .ok("OK")
            .targetEvent(ev)
        ).then(function(data){
            if(callback != undefined && data){
                callback();
            }
        });
    };
});
