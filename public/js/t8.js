var app = angular.module('t8', ['ui.tinymce', 'ngSanitize', 'ngFileUpload']);

app.controller('UploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {
    // upload on file select or drop
    $scope.upload = function (file) {
        console.log("Start upload", file);
        if(!file)// If the file is not valid (null), don't upload
            return
        Upload.upload({
            url: '/upload',
            data: {file: file}
        }).then(function (resp) {
            if(resp.data.success){
                var path = resp.data.path;
                $scope.$parent.$parent.currQuestion.image = path;
                console.log('Success uploaded. Response: ', path);
            }
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
}]);

app.controller('editorCtrl', ['$scope', function ($scope) {
    $scope.questions = [
        {title: "TitelPåFråga",
         type: "normal",
         hints: [],
         statements: ["hejsan","hoppsan","jaja","ett till påstående", "hejsan hoppsan?"],
         image: "/images/ogonmatt.jpg",
         timeText: "15 sekunder per påstående",
         scoringText: "1 poäng per rätt påstående",
         maxScoringText: "Totalt 6 poäng",
         slides: [
             {time: 15, textLeft: "<p>Initial <strong>content</strong> left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"}
         ]},
        {title: "Solförmörkelser",
         type: "normal",
         hints: [],
         statements: [],
         image: "/images/solformorkelse.jpg",
         timeText: "4 minuter",
         scoringText: "2 poäng per rätt",
         maxScoringText: "Totalt 6 poäng",
         slides: [
             {time: 4*60, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
             {time: 4*60, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"},
             {time: 4*60, textLeft: "<p>Lite mer text.. ASft. eft</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"}
         ]},
        {title: "Spagettitorn",
         type: "normal",
         hints: [],
         statements: [],
         image: "/images/spagettitorn.jpg",
         timeText: "2 minuer",
         scoringText: "5 poäng per rätt påstående",
         maxScoringText: "10 poäng",
         slides: [
             {time: 2*60, textLeft: "<p>Initial adsas aasd a sd asd left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"}
         ]},
        {title: "Arbetsfördelning",
         type: "normal",
         hints: [],
         statements: [],
         image: "/images/arbetsfordelning.jpg",
         timeText: "15 sekunder per påstående",
         scoringText: "1 poäng per rätt påstående",
         maxScoringText: "Totalt 6 poäng",
         slides: [
             {time: 15, textLeft: "<p>Initial sdfsddsfsdjfhsdfhsdjfkhsdfjkhsdfjksdb dh sdfkjhd fjh sdjkfh sdfjkh sdfjkh sdfj hsdjf sdjkfh sdfjh sdjkfh sdkjfh sdjkfh sdjkfh sdfjkhsd fjkhsd fjksdh fsjh  hjdsf hsdkjfh sdfjkhsd fjkhsd fjhsd fjksdfh sdjkfh sdfjkhsd fjksdh fjksdh dfhsd fjkls sfhdsdhfjksdhfjksdhfsdjkhfjkashfjkasdhfjksdhfjkahsdfkjhaskldfh asd asd asd asd left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"}
         ]},
        {title: "Lampor",
         type: "normal",
         hints: [],
         statements: [],
         image: "/images/lampor.jpg",
         timeText: "15 sekunder per påstående",
         scoringText: "1 poäng per rätt påstående",
         maxScoringText: "Totalt 6 poäng",
         slides: [
             {time: 15, textLeft: "<p>Initial <strong>content</strong> left</p>", textRight: "<p>Initial <strong>content</strong> right</p>", textProjector: "Initial <strong>content</strong> projector"}
         ]}
    ];
    $scope.index = function(question){
        var index = -1;
        $scope.questions.some(function(obj, i) {
            return obj === question ? index = i : false;
        });
        return index+1;
    }
    $scope.changeSlide = function(question,slide){
        $scope.currQuestion=question;
        $scope.currSlide=slide;
    }
    $scope.currQuestion = $scope.questions[0];
    $scope.currSlide = $scope.currQuestion.slides[0];
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

}]);



app.directive("competitor", function() {
    return {
        templateUrl: "/template/competitor.html",
        restrict: "E",
        scope: {
            slide: '=',
            question: '=',
            editable: '='
        },
        link: function(scope) {
            scope.removeHint = function(index){
                scope.question.hints.splice(index, 1);
            }
            scope.removeStatement = function(index){
                scope.question.statements.splice(index, 1);
            }
            scope.addHint = function(){
                scope.question.hints.push('');
            }
            scope.addStatement = function(){
                scope.question.statements.push('');
            }
        }
    }
});


app.directive("projector", function(){
    return {
        templateUrl: "/template/projector.html",
        scope: {
            slide: '=',
            question: '=',
            editable: '='
        },
        restrict: "E"
    }
});




app.controller('questionCtrl', function($scope){
    // TODO: Implement
});


app.controller('answerCtrl', function($scope) {
    // TODO: Implement
});
