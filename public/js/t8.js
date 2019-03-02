var app = angular.module('t8', ['ui.tinymce', 'ngSanitize', 'ngFileUpload','ui.bootstrap']);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);




app.directive('imgPreload', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        scope: {
            ngSrc: '@'
        },
        link: function(scope, element, attrs) {
            element.on('load', function() {
                element.removeClass('hide');
            }).on('error', function() {
                //
            });

            scope.$watch('ngSrc', function(newVal) {
                element.addClass('hide');
            });
        }
    };
}]);

