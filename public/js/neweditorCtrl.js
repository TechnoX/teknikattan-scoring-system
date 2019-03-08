app.controller('neweditorCtrl', ['$scope', '$http', '$routeParams', '$uibModal', function ($scope, $http, $routeParams, $uibModal) {
    var competition_id = parseInt($routeParams.id);
    $scope.slideIndex = 0;
    $scope.questionIndex = 0;
    switch($routeParams.medium){
    case 'projector':
        $scope.medium = "projector";
        break;
    case 'competitor':
        $scope.medium = "competitor";
        break;
    case 'answer':
        $scope.medium = "answer";
        break;
    default:
        $scope.medium = "projector";
    }
    $scope.showTimeline = false;
    $scope.nextDown = {'projector': 'competitor', 'competitor': 'answer'};
    $scope.nextUp = {'answer': 'competitor', 'competitor': 'projector'};
    
    // Get all questions
    $http.get('/competition/'+competition_id+'/questions').then(function(resp) {
        $scope.questions = resp.data;
        if($scope.questions.length > 0){
            $scope.currQuestion = $scope.questions[0];
            $scope.currSlide = $scope.currQuestion.slides[0];
        }
    });
    
    $scope.save = function(question){
        if(!$scope.correct()){
            return false;
        }
        $http.put('/competition/'+competition_id+'/questions', $scope.questions).then(function(res){
            alert("Allting sparades korrekt!");
            console.log(res);
        }, function(res){
            alert("Något gick fel när frågorna skulle sparas!");
            console.log(res);
        });
    }

    $scope.correct = function(){
        for(var i = 0; i < $scope.questions.length; i++){
            if($scope.questions[i].type == 'hints' || $scope.questions[i].type == 'truefalse'){
                if(!$scope.questions[i].slides[$scope.questions[i].slides.length - 1].hasTimer){
                    alert("Sista sliden för fråga " + (i+1) + " måste ha en timer, eftersom frågan är en ledtråds- eller sant/falskt-fråga.");
                    console.log("Sista sliden för fråga " + (i+1) + " måste ha en timer, eftersom frågan är en ledtråds- eller sant/falskt-fråga.");
                    return false;
                }
            }
        }
        return true;
    }


    $scope.open = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/template/answer_modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                question: function () {
                    return $scope.currQuestion;
                }
            }
        });

        modalInstance.result.then(function (answer) {
            console.info('Modal okayed at: ' + new Date());
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };

    
    
    $scope.changeSlide = function(questionIndex, slideIndex, medium){
        $scope.questionIndex = questionIndex;
        $scope.slideIndex = slideIndex;
        $scope.medium = medium;
        $scope.currQuestion = $scope.questions[$scope.questionIndex];
        $scope.currSlide = $scope.currQuestion.slides[$scope.slideIndex];
    }
    $scope.addQuestion = function () {
        var index = $scope.index($scope.currQuestion);
        var question = {title: "TitelPåFråga",
                        type: "normal",
                        hints: [],
                        statements: [],
                        quiz: [],
                        image: "/images/dummy.jpg",
                        timeText: "? minuter",
                        scoringText: "? poäng per rätt svar",
                        maxScoringText: "Totalt ? poäng",
                        answer: {type: 'multi', pairs: [[],[]], subQuestions: []},
                        slides: [
                            {hasTimer: true, time: 2*60, textLeft: "<p></p>", textRight: "<p></p>", textProjector: "<p></p>"}
                        ]
                       };
        $scope.questions.splice(index, 0, question);
        $scope.currQuestion = $scope.questions[index];
        $scope.currSlide = $scope.currQuestion.slides[0];
        $scope.questionIndex = index;
        $scope.slideIndex = 0;
    };

    $scope.addSlide = function () {
        var slide = {hasTimer: true, time: 2*60, textLeft: "<p></p>", textRight: "<p></p>", textProjector: "<p></p>"};
        var index = $scope.currQuestion.slides.indexOf($scope.currSlide) + 1;
        $scope.currQuestion.slides.splice(index, 0, slide);
        $scope.currSlide = $scope.currQuestion.slides[index];
        $scope.slideIndex = index;
    };

    $scope.removeSlide = function(questionIndex,slideIndex){
        var question = $scope.questions[questionIndex];
        var slide = question.slides[slideIndex];

        if(question.slides.length == 1){

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
    

    
    $scope.index = function(question){
        var index = -1;
        if($scope.questions){
            $scope.questions.some(function(obj, i) {
                return obj === question ? index = i : false;
            });
        }
        return index+1;
    }

    
    $scope.editOptions = {
        theme: 'inlite',
        plugins: 'image media table paste contextmenu textpattern lists',
        insert_toolbar: 'image quicktable media',
        selection_toolbar: 'bold italic | list bullist',
        inline: true,
        forced_root_block : false,
        paste_data_images: true,
        content_css: []
    };

    
}]);
