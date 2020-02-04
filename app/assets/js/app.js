/// <reference path="vendor/angular.min.js" />

(function () {
    var app = angular.module("MainModule", ['ngSanitize', 'ngRoute', 'highcharts-ng']);

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/login', {
                controller: 'MainController',
                templateUrl: 'Login.html'
            })

            .when('/main', {
                controller: 'MainController',
                templateUrl: 'Main.html'
            })

            .otherwise({ redirectTo: '/login' });
    }])

    app.run(['$rootScope', '$location', '$http', "$api", function ($rootScope, $location, $http, $api) {


        $rootScope.$on('$locationChangeStart', function (event, next, current) {

            //console.log($api.isAuthenticated());

            if (!$api.isAuthenticated()) {
                $location.path('/login');
            }

        });
    }]);






}())
