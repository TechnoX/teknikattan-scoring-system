var app = angular.module('t8', ['ui.tinymce', 'ngSanitize', 'ngFileUpload','ui.bootstrap']);

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);


app.directive('stringToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(value) {
                return '' + value;
            });
            ngModel.$formatters.push(function(value) {
                return parseFloat(value);
            });
        }
    };
});


app.directive('setFocus', function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.setFocus);
            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    };
});


app.directive('multipleChoices', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            // How view values will be saved in the model
            ngModel.$parsers.push(function(value) {
                var text = "";
                var arr = document.getElementsByName(attrs.name);
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].checked)
                        text += ";" + arr[i].value;
                }
                text = text.substring(1);
                return text;
            });
            // How model values will appear in the view
            ngModel.$formatters.push(function(value) {
                // TODO: Attrs.value is always undefined when page loads since value has not have had time to update before this is ran
                //console.log("formatter value: '" + value + "'");
                //console.log("attrs value: '" + attrs.value + "'");
                if(value === undefined || value === null)
                    return false;
                //console.log(value.split(";"))
                //console.log(value.split(";").indexOf(attrs.value));
                return value.split(";").indexOf(attrs.value) != -1;
            });
        }
    };
});


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
