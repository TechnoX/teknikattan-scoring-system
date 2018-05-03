

var app = angular.module('t8', []);
app.controller('editorCtrl', function($scope) {

    $scope.$on('$includeContentLoaded', function(event) {
        tinymce.init({
            selector: 'div.tinymce',
            theme: 'inlite',
            plugins: 'image media table link paste contextmenu textpattern autolink codesample',
            insert_toolbar: 'quickimage quicktable media codesample',
            selection_toolbar: 'bold italic | quicklink h2 h3',
            inline: true,
            paste_data_images: true,
            content_css: []
        });
    });

    $scope.numHints = 1;
    $scope.numTruefalse = 1;
    $scope.numQuestions = 1;
    $scope.numAlternatives = 1;
    $scope.numPairsB = 1;
    $scope.numPairsA = 1;
    $scope.title = "1. TitelPåFråga";
    $scope.timeText = "15 sekunder per påstående";
    $scope.scoringText = "1 poäng per rätt påstående";
    $scope.maxScoringText = "Totalt 6 poäng";
    $scope.time = "00:15";

    
    $scope.range = function(n) {
        return new Array(n);
    };

});

