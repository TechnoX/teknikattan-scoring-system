

var app = angular.module('t8', ['ui.tinymce']);
app.controller('editorCtrl', function($scope) {

    $scope.tinymceOptions = {
        theme: 'inlite',
        plugins: 'image media table link paste contextmenu textpattern autolink',
        insert_toolbar: 'quickimage quicktable media',
        selection_toolbar: 'bold italic | quicklink h2 h3',
        inline: true,
        forced_root_block : false,
        paste_data_images: true,
        content_css: []
    };
    
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
    $scope.time = 15;
    $scope.textLeft = "<p>Initial <strong>content</strong> left</p>";
    $scope.textRight = "<p style='color: red;'>Initial <strong>content</strong> right</p>";
    $scope.textProjector = "Initial <strong>content</strong> projector";

    
    $scope.range = function(n) {
        return new Array(n);
    };

});

app.controller('questionCtrl', function($scope) {
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
    $scope.time = 15;
    $scope.textLeft = "<p>Initial <strong>content</strong> left</p>";
    $scope.textRight = "<p style='color: red;'>Initial <strong>content</strong> right</p>";
    $scope.textProjector = "Initial <strong>content</strong> projector";

});
app.controller('answerCtrl', function($scope) {
    // TODO: Implement
});
