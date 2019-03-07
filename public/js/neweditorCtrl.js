app.controller('neweditorCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.competitionId = parseInt($routeParams.id);
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
    $http.get('/competition/'+$scope.competitionId+'/questions').then(function(resp) {
        $scope.questions = resp.data;
        if($scope.questions.length > 0){
            $scope.currQuestion = $scope.questions[0];
            $scope.currSlide = $scope.currQuestion.slides[0];
        }
    });
    
    
    
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
    };

    $scope.addSlide = function () {
        var slide = {hasTimer: true, time: 2*60, textLeft: "<p></p>", textRight: "<p></p>", textProjector: "<p></p>"};
        var index = $scope.currQuestion.slides.indexOf($scope.currSlide) + 1;
        $scope.currQuestion.slides.splice(index, 0, slide);
        $scope.currSlide = $scope.currQuestion.slides[index];
    };


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
