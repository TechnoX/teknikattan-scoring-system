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


app.directive('highlighter', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            model: '=highlighter'
        },
        link: function(scope, element) {
            scope.$watch('model', function (nv, ov) {
                if (nv !== ov) {
                    console.log("Highlight!");
                    // apply class
                    element.addClass('highlight');

                    // auto remove after some delay
                    $timeout(function () {
                        element.removeClass('highlight');
                    }, 3000);
                }
            });
        }
    };
}]);
