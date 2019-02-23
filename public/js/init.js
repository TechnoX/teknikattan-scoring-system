
var app = angular.module('t8', ['ngRoute', 'ngSanitize', 'ngFileUpload']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'view/home.html'
  })
  .when('/users', {
    templateUrl: 'view/users.html',
    controller: 'managementCtrl',
  })
  .when('/competitions', {
    templateUrl: 'view/competitions.html',
    controller: 'managementCtrl',
  })
  .when('/competition/:id', {
    templateUrl: 'view/competition.html',
    controller: 'managementCtrl',
  })
  .when('/cities', {
    templateUrl: 'view/cities.html',
    controller: 'managementCtrl',
  })
  .when('/competition/:id/editor', {
    templateUrl: 'view/editor.html',
    controller: 'editorCtrl',
  })
  .when('/competition/:id/result', {
    templateUrl: 'view/result.html',
    controller: 'resultCtrl',
  })
  .when('/competition/:id/judge', {
    templateUrl: 'view/judge.html',
    controller: 'questionCtrl',
  })
  .when('/competition/:id/control', {
    templateUrl: 'view/control.html',
    controller: 'controlCtrl',
  })
  .when('/competition/:id/projector', {
    templateUrl: 'view/projector.html',
    controller: 'questionCtrl',
  })
  .when('/competition/:id/competitors', {
    templateUrl: 'view/competitors.html',
    controller: 'questionCtrl',
  })
  .when('/competition/:id/answers/:team', {
    templateUrl: 'view/answers.html',
    controller: 'questionCtrl',
  })
  .when('/competition/:id/audience', {
    templateUrl: 'view/answers.html',
    controller: 'audienceCtrl',
  })

  // configure html5 to get links working on jsfiddle
  //$locationProvider.html5Mode(true);
});
