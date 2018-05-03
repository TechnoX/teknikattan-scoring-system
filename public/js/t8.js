

var app = angular.module('t8', ['ui.tinymce', 'ngSanitize']);
app.controller('editorCtrl', function($scope) {
    $scope.slides = [
        {index: 1, title: "TitelPåFråga", image: "/images/ogonmatt.jpg", timeText: "15 sekunder per påstående", scoringText: "1 poäng per rätt påstående", maxScoringText: "Totalt 6 poäng", time: 15, hasTimer: true, textLeft: "<p>Initial <strong>content</strong> left</p>", textRight: "<p style='color: red;'>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 2, title: "Solförmörkelser", image: "/images/solformorkelse.jpg", timeText: "4 minuter", scoringText: "2 poäng per rätt", maxScoringText: "Totalt 6 poäng", time: 4*60, hasTimer: true, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p style='color: red;'>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 3, title: "Spagettitorn", image: "/images/spagettitorn.jpg", timeText: "2 minuer", scoringText: "5 poäng per rätt påstående", maxScoringText: "10 poäng", time: 2*60, hasTimer: true, textLeft: "<p>Initial adsas aasd a sd asd left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 4, title: "Arbetsfördelning", image: "/images/arbetsfordelning.jpg", timeText: "15 sekunder per påstående", scoringText: "1 poäng per rätt påstående", maxScoringText: "Totalt 6 poäng", time: 15, hasTimer: true, textLeft: "<p>Initial <strong>content</strong> left</p>", textRight: "<p style='color: red;'>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 5, title: "Lampor", image: "/images/lampor.jpg", timeText: "15 sekunder per påstående", scoringText: "1 poäng per rätt påstående", maxScoringText: "Totalt 6 poäng", time: 15, hasTimer: true, textLeft: "<p>Initial <strong>content</strong> left</p>", textRight: "<p style='color: red;'>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"}];


    $scope.currIndex = 0;
    $scope.numHints = 1;
    $scope.numTruefalse = 1;
    $scope.numQuestions = 1;
    $scope.numAlternatives = 1;
    $scope.numPairsB = 1;
    $scope.numPairsA = 1;
    /*
    $scope.addNewSlider = function () {
        $scope.slides.push({
            title: 'NyFråga',
            image: '/asd/asd'
        });
    };*/
    
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
    
    
    $scope.range = function(n) {
        return new Array(n);
    };

});



app.directive("competitor", function() {
    return {
        templateUrl: "/template/competitor.html",
        scope: {
            slide: '@',
        },
        restrict: "E"
    }
});


app.directive("projector", function(){
    return {
        templateUrl: "/template/projector.html",
        restrict: "E"
    }
});




app.controller('questionCtrl', function(){
/*    $scope.numHints = 1;
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
    $scope.hasTimer = true;
    $scope.textLeft =  $sce.trustAsHtml("<p>Initial <strong>content</strong> left</p>");
    $scope.textRight =  $sce.trustAsHtml("<p style='color: red;'>Initial <strong>content</strong> right</p>");
    $scope.textProjector =  $sce.trustAsHtml("Initial <strong>content</strong> projector");
*/
    // TODO: Implement
});


app.controller('answerCtrl', function($scope) {
    // TODO: Implement
});
