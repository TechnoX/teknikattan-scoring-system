
var app = angular.module('t8', ['ngRoute', 'ngSanitize']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'view/home.html'
  })
  .when('/users', {
    templateUrl: 'view/users.html',
    controller: 'mainCtrl',
  })
  .when('/competitions', {
    templateUrl: 'view/competitions.html',
    controller: 'mainCtrl',
  })
  .when('/competition/:id', {
    templateUrl: 'view/competition.html',
    controller: 'mainCtrl',
  })
  .when('/cities', {
    templateUrl: 'view/cities.html',
    controller: 'mainCtrl',
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
    controller: 'judgeCtrl',
  })
  .when('/competition/:id/projector', {
    templateUrl: 'view/projector.html',
    controller: 'questionCtrl',
  })
  .when('/competition/:id/competitor', {
    templateUrl: 'view/competitor.html',
    controller: 'questionCtrl',
  })
  .when('/competition/:id/answers', {
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