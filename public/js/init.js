
var app = angular.module('t8', ['ngRoute', 'ngSanitize', 'ngFileUpload','ui.bootstrap', 'ui.tinymce', 'angular-jwt']);

app.config(function($routeProvider, $locationProvider, $httpProvider, jwtOptionsProvider) {
  $routeProvider
  .when('/', {
      templateUrl: 'view/home.html',
      controller: 'loginCtrl'
  })
  .when('/users', {
    templateUrl: 'view/users.html',
    controller: 'managementCtrl',
  })
  .when('/media', {
    templateUrl: 'view/media.html',
    controller: 'managementCtrl',
  })
  .when('/competitions', {
    templateUrl: 'view/competitions.html',
    controller: 'managementCtrl',
  })
  .when('/competitions/analytics', {
    templateUrl: 'view/analytics.html',
    controller: 'analyticsCtrl',
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
  .when('/competition/:id/neweditor', {
    templateUrl: 'view/neweditor.html',
    controller: 'neweditorCtrl',
  })
  .when('/competition/:id/result', {
    templateUrl: 'view/result.html',
    controller: 'resultCtrl',
  })
  .when('/competition/:id/judge', {
    templateUrl: 'view/judge.html',
    controller: 'judgeCtrl',
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
  .when('/competition/:id/counter', {
    templateUrl: 'view/counter.html',
    controller: 'questionCtrl',
  })
  .when('/competition/:id/answers/:team', {
    templateUrl: 'view/answers.html',
    controller: 'answerCtrl',
  })
  .when('/competition/:id/audience', {
    templateUrl: 'view/audience.html',
    controller: 'judgeCtrl',
  })

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);

    jwtOptionsProvider.config({
        tokenGetter: [function() {
            //myService.doSomething();
            return localStorage.getItem('t8_token');
        }],
        unauthenticatedRedirectPath: '/'
    });

  $httpProvider.interceptors.push('jwtInterceptor');
});


app.run(function(authManager) {
    authManager.checkAuthOnRefresh();
    authManager.redirectWhenUnauthenticated();
});
