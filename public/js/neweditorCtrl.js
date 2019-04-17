app.controller('neweditorCtrl', ['$scope', '$http', '$routeParams', '$uibModal', function ($scope, $http, $routeParams, $uibModal) {
    var competition_id = $routeParams.id;
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
    $http.get('/api/competition/'+competition_id+'/questions').then(function(resp) {
        $scope.questions = resp.data;
        if($scope.questions.length > 0){
            $scope.currQuestion = $scope.questions[0];
            $scope.currSlide = $scope.currQuestion.slides[0];
        }else{
            $scope.addQuestion();
        }
    });
    
    $scope.save = function(question){
        if(!confirm("Om någon har svarat på frågorna så försvinner deras svar när du uppdaterar frågorna. Vill du verkligen göra uppdateringar av frågorna?" )){
            return false;
        }
        if(!$scope.correct()){
            return false;
        }
        $http.put('/api/competition/'+competition_id+'/questions', $scope.questions).then(function(res){
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
        var question = {competition: competition_id,
                        title: "TitelPåFråga",
                        type: "normal",
                        hints: [],
                        statements: [],
                        quiz: [],
                        image: "/images/dummy.jpg",
                        timeText: "? minuter",
                        scoringText: "? poäng per rätt svar",
                        maxScoringText: "Totalt ? poäng",
                        answer: {type: 'multi', pairs: [{alternatives: [], multiple: false}, {alternatives: [], multiple: false}], subQuestions: []},
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


        // If question only have one slide, remove the question
        if(question.slides.length == 1){
            $scope.questions.splice(questionIndex, 1);
            // If we remove the current displayed question
            if(questionIndex == $scope.questionIndex){
                // If we removed the last question
                if(questionIndex == $scope.questions.length){
                    // If this is the last and only question, alert error message
                    if(questionIndex == 0) {
                        alert("Du kan inte ta bort den sista frågesliden, en frågesport måste bestå av minst en fråga.");
                        return false;
                    }
                    // Display the question before (i.e the new last question)
                    $scope.questionIndex -= 1;
                    // The last slide on the new question
                    $scope.slideIndex = $scope.questions[$scope.questionIndex].slides.length - 1;
                }else{// Otherwise display the question at the same index as the removed question (i.e. the one after the removed one).
                    // Do nothing, keep the questionIndex as before.
                    $scope.slideIndex = 0;
                }
            }else if(questionIndex < $scope.questionIndex){// If we removed a question before the current displayed question
                // Decrease the index of the current displayed question.
                $scope.questionIndex -= 1;
            }

        }else{// If the question has more than one slide, remove the slide
            question.slides.splice(slideIndex, 1);
            // If we remove the current displayed slide
            if(slideIndex == $scope.slideIndex){
                // If we removed the last slide of the last question
                if(slideIndex == question.slides.length && questionIndex == $scope.questions.length-1){
                    // Display the slide just before the newly removed slide.
                    $scope.slideIndex -= 1;
                }else if(slideIndex == question.slides.length){ // If we removed the last slide of a question in the middle somewhere
                    // Display the first slide of the next question
                    $scope.questionIndex += 1;
                    $scope.slideIndex = 0;
                }else{// Otherwise display the slide at the same index as the removed slide (i.e. the one after the removed one).
                    // Do nothing, keep the slideIndex as before.
                }
            }else if(questionIndex == $scope.questionIndex && slideIndex < $scope.slideIndex){// If we removed a slide before the current displayed slide, at the current viewed question
                // Decrease the index of the current displayed slide.
                $scope.slideIndex -= 1;
            }
        }
        
        $scope.currQuestion = $scope.questions[$scope.questionIndex];
        $scope.currSlide = $scope.currQuestion.slides[$scope.slideIndex];
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
