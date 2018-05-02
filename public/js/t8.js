var app = angular.module('t8', []);
app.controller('editorCtrl', function($scope) {
    $scope.numHints = 1;
    $scope.numTruefalse = 1;
    $scope.numQuestions = 1;
    $scope.numAlternatives = 1;
    $scope.numPairsB = 1;
    $scope.numPairsA = 1;

    $scope.range = function(n) {
        return new Array(n);
    };

});

