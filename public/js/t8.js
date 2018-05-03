

var app = angular.module('t8', ['ui.tinymce', 'ngSanitize']);
app.controller('editorCtrl', function($scope) {
    $scope.slides = [
        {index: 1, order: 2, title: "TitelPåFråga", image: "/images/ogonmatt.jpg", timeText: "15 sekunder per påstående", scoringText: "1 poäng per rätt påstående", maxScoringText: "Totalt 6 poäng", time: 15, hasTimer: true, textLeft: "<p>Initial <strong>content</strong> left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 2, order: 4, title: "Solförmörkelser", image: "/images/solformorkelse.jpg", timeText: "4 minuter", scoringText: "2 poäng per rätt", maxScoringText: "Totalt 6 poäng", time: 4*60, hasTimer: false, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 2, order: 6, title: "Solförmörkelser", image: "/images/solformorkelse.jpg", timeText: "4 minuter", scoringText: "2 poäng per rätt", maxScoringText: "Totalt 6 poäng", time: 4*60, hasTimer: false, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 2, order: 5, title: "Solförmörkelser", image: "/images/solformorkelse.jpg", timeText: "4 minuter", scoringText: "2 poäng per rätt", maxScoringText: "Totalt 6 poäng", time: 4*60, hasTimer: true, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 3, order: 1, title: "Spagettitorn", image: "/images/spagettitorn.jpg", timeText: "2 minuer", scoringText: "5 poäng per rätt påstående", maxScoringText: "10 poäng", time: 2*60, hasTimer: true, textLeft: "<p>Initial adsas aasd a sd asd left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 4, order: 2, title: "Arbetsfördelning", image: "/images/arbetsfordelning.jpg", timeText: "15 sekunder per påstående", scoringText: "1 poäng per rätt påstående", maxScoringText: "Totalt 6 poäng", time: 15, hasTimer: true, textLeft: "<p>Initial sdfsddsfsdjfhsdfhsdjfkhsdfjkhsdfjksdb dh sdfkjhd fjh sdjkfh sdfjkh sdfjkh sdfj hsdjf sdjkfh sdfjh sdjkfh sdkjfh sdjkfh sdjkfh sdfjkhsd fjkhsd fjksdh fsjh  hjdsf hsdkjfh sdfjkhsd fjkhsd fjhsd fjksdfh sdjkfh sdfjkhsd fjksdh fjksdh dfhsd fjkls sfhdsdhfjksdhfjksdhfsdjkhfjkashfjkasdhfjksdhfjkahsdfkjhaskldfh asd asd asd asd left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 5, order: 5, title: "Lampor", image: "/images/lampor.jpg", timeText: "15 sekunder per påstående", scoringText: "1 poäng per rätt påstående", maxScoringText: "Totalt 6 poäng", time: 15, hasTimer: true, textLeft: "<p>Initial <strong>content</strong> left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"}];

    $scope.changeSlide = function(slide){
        $scope.currSlide=slide;
    }
    $scope.currSlide = $scope.slides[0];
    $scope.numHints = 1;
    $scope.numTruefalse = 1;
    $scope.numQuestions = 1;
    $scope.numAlternatives = 1;
    $scope.numPairsB = 1;
    $scope.numPairsA = 1;
    
    /*
    $scope.addNewQuestion = function () {
        $scope.slides.push({
            title: 'NyFråga',
            image: '/asd/asd'
        });
    };*/
    
    $scope.editOptions = {
        theme: 'inlite',
        plugins: 'image media table paste contextmenu textpattern lists',
        insert_toolbar: 'quickimage quicktable media',
        selection_toolbar: 'bold italic | list bullist',
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
            slide: '=',
            editable: '='
        },
        restrict: "E"
    }
});


app.directive("projector", function(){
    return {
        templateUrl: "/template/projector.html",
        scope: {
            slide: '=',
            editable: '='
        },
        restrict: "E"
    }
});




app.controller('questionCtrl', function($scope){
    $scope.slides = [
        {index: 1, title: "TitelPåFråga", image: "/images/ogonmatt.jpg", timeText: "15 sekunder per påstående", scoringText: "1 poäng per rätt påstående", maxScoringText: "Totalt 6 poäng", time: 15, hasTimer: true, textLeft: "<p>Initial <strong>content</strong> left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 2, title: "Solförmörkelser", image: "/images/solformorkelse.jpg", timeText: "4 minuter", scoringText: "2 poäng per rätt", maxScoringText: "Totalt 6 poäng", time: 4*60, hasTimer: false, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 2, title: "Solförmörkelser", image: "/images/solformorkelse.jpg", timeText: "4 minuter", scoringText: "2 poäng per rätt", maxScoringText: "Totalt 6 poäng", time: 4*60, hasTimer: false, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 2, title: "Solförmörkelser", image: "/images/solformorkelse.jpg", timeText: "4 minuter", scoringText: "2 poäng per rätt", maxScoringText: "Totalt 6 poäng", time: 4*60, hasTimer: true, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 3, title: "Spagettitorn", image: "/images/spagettitorn.jpg", timeText: "2 minuer", scoringText: "5 poäng per rätt påstående", maxScoringText: "10 poäng", time: 2*60, hasTimer: true, textLeft: "<p>Initial adsas aasd a sd asd left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 4, title: "Arbetsfördelning", image: "/images/arbetsfordelning.jpg", timeText: "15 sekunder per påstående", scoringText: "1 poäng per rätt påstående", maxScoringText: "Totalt 6 poäng", time: 15, hasTimer: true, textLeft: "<p>Initial sdfsddsfsdjfhsdfhsdjfkhsdfjkhsdfjksdb dh sdfkjhd fjh sdjkfh sdfjkh sdfjkh sdfj hsdjf sdjkfh sdfjh sdjkfh sdkjfh sdjkfh sdjkfh sdfjkhsd fjkhsd fjksdh fsjh  hjdsf hsdkjfh sdfjkhsd fjkhsd fjhsd fjksdfh sdjkfh sdfjkhsd fjksdh fjksdh dfhsd fjkls sfhdsdhfjksdhfjksdhfsdjkhfjkashfjkasdhfjksdhfjkahsdfkjhaskldfh asd asd asd asd left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
        {index: 5, title: "Lampor", image: "/images/lampor.jpg", timeText: "15 sekunder per påstående", scoringText: "1 poäng per rätt påstående", maxScoringText: "Totalt 6 poäng", time: 15, hasTimer: true, textLeft: "<p>Initial <strong>content</strong> left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"}];

    $scope.currSlide = $scope.slides[5];
});


app.controller('answerCtrl', function($scope) {
    // TODO: Implement
});
