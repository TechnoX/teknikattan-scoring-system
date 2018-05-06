var app = angular.module('t8', ['ui.tinymce', 'ngSanitize', 'ngFileUpload','ui.bootstrap']);

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

app.controller('editorCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {
   
    $scope.open = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/template/answer_modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                answer: function () {
                    return $scope.currQuestion.answer;
                }
            }
        });

        modalInstance.result.then(function (answer) {
            console.info('Modal okayed at: ' + new Date());
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };

    
    $scope.questions = [
        {title: "TitelPåFråga",
         type: "normal",
         hints: [],
         statements: ["hejsan","hoppsan","jaja","ett till påstående", "hejsan hoppsan?"],
         image: "/images/ogonmatt.jpg",
         timeText: "15 sekunder per påstående",
         scoringText: "1 poäng per rätt påstående",
         maxScoringText: "Totalt 6 poäng",
         answer: {type: 'pairing', pairs: [['svart','grön','röd','blå'],['0','5','2','6']], subQuestions: [{type: 'number', alternatives: []},{type:'number', alternatives: []},{type:'text'},{type:'select', alternatives: ['hund','katt','varg','lejon','elefant']}]},
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
         answer: {type: 'multi', pairs: [['svart','grön','röd','blå'],['0','5','2','6']], subQuestions: [{type: 'number', alternatives: []},{type:'number', alternatives: []},{type:'text'},{type:'select', alternatives: ['hund','katt','varg','lejon','elefant']}], show: true, text: "<p>En spindel har <strong>fyra</strong> ben</p>"},
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
         scoringText: "Högsta får 6p, näst högsta 4p och lägsta 2p",
         maxScoringText: "6 poäng",
         answer: {type: 'practical', pairs: [['svart','grön','röd','blå'],['0','5','2','6']], subQuestions: [{type: 'number', alternatives: []},{type:'number', alternatives: []},{type:'text'},{type:'select', alternatives: ['hund','katt','varg','lejon','elefant']}], show: true, text: "<p>Svart betyder 0<br>Grön betyder 5<br>Röd betyder 2<br>Blå betyder 6</p>"},
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
         answer: {type: 'multi', pairs: [['svart','grön','röd','blå'],['0','5','2','6']], subQuestions: [{type: 'number', alternatives: []},{type:'number', alternatives: []},{type:'text'},{type:'select', alternatives: ['hund','katt','varg','lejon','elefant']}], show: false, text:"<p></p>"},
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
         answer: {type: 'pairing', pairs: [['svart','grön','röd','blå'],['0','5','2','6']], subQuestions: [{type: 'number', alternatives: []},{type:'number', alternatives: []},{type:'text'},{type:'select', alternatives: ['hund','katt','varg','lejon','elefant']}], show: false, text: "<p></p>"},
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
    $scope.removeSlide = function(question,slide){
        if(question.slides.length == 1){
            var questionIndex = $scope.index(question) - 1;

            // Only update current viewed question if it was the deleted one
            if(question === $scope.currQuestion){
                // If this was the last question, take the one before, otherwise the one after
                if(questionIndex == $scope.questions.length - 1){
                    // Question before
                    $scope.currQuestion = $scope.questions[questionIndex - 1];
                    // If we remove the last existing slide?
                    if(!$scope.currQuestion){
                        $scope.currSlide = null;
                    }else{
                        // Last slide in this new question
                        $scope.currSlide = $scope.currQuestion.slides[$scope.currQuestion.slides.length - 1];
                    }
                }else{
                    // Question after
                    $scope.currQuestion = $scope.questions[questionIndex + 1];
                    // First slide in this new question
                    $scope.currSlide = $scope.currQuestion.slides[0];
                }
            }
            $scope.questions.splice(questionIndex, 1);
        }else{
            var slideIndex = question.slides.indexOf(slide);
            
            // Only update current viewed slide if it was the deleted one
            if(slide === $scope.currSlide){
                // If this was the last slide, take the one before, otherwise the one after
                if(slideIndex == question.slides.length - 1){
                    $scope.currSlide = question.slides[slideIndex - 1];
                }else{
                    $scope.currSlide = question.slides[slideIndex + 1];
                }
            }
            question.slides.splice(slideIndex, 1);
        }
    }
    $scope.currQuestion = $scope.questions[0];
    $scope.currSlide = $scope.currQuestion.slides[0];
    
    $scope.addQuestion = function () {
        var index = $scope.index($scope.currQuestion);
        var question = {title: "TitelPåFråga",
                        type: "normal",
                        hints: [],
                        statements: [],
                        image: "/images/dummy.jpg",
                        timeText: "? minuter",
                        scoringText: "? poäng per rätt svar",
                        maxScoringText: "Totalt ? poäng",
                        answer: {type: 'multi', pairs: [[],[]], subQuestions: []},
                        slides: [
                            {time: 2*60, textLeft: "<p></p>", textRight: "<p></p>", textProjector: "<p></p>"}
                        ]
                       };
        $scope.questions.splice(index, 0, question);
        $scope.currQuestion = $scope.questions[index];
        $scope.currSlide = $scope.currQuestion.slides[0];
    };

    $scope.addSlide = function () {
        var slide = {time: 2*60, textLeft: "<p></p>", textRight: "<p></p>", textProjector: "<p></p>"};
        var index = $scope.currQuestion.slides.indexOf($scope.currSlide) + 1;
        $scope.currQuestion.slides.splice(index, 0, slide);
        $scope.currSlide = $scope.currQuestion.slides[index];
    };
    
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



// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, answer) {
    $scope.answer = answer;
    $scope.tinymceOptions = {
        plugins: 'image media paste contextmenu textpattern lists',
        menubar: 'edit insert',
        toolbar: 'bold italic  image numlist bullist',
        forced_root_block : false,
        paste_data_images: true
    };
    
    $scope.remove = function(array, index){
        array.splice(index, 1);
    }

    $scope.add = function(array, subquestion){
        if(subquestion){
            array.push({type: 'text', alternatives: []});
        }else{
            array.push('');
        }
    }
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.answer);
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


app.controller('questionCtrl', function($scope){
    // TODO: Implement
});


app.controller('answerCtrl', function($scope) {
    // TODO: Implement
});
