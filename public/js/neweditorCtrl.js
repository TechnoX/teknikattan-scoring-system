app.controller('neweditorCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.competitionId = parseInt($routeParams.id);
    if($routeParams.slide && $routeParams.question){
        $scope.slideIndex = parseInt($routeParams.slide);
        $scope.questionIndex = parseInt($routeParams.question);
    }else{
        $scope.slideIndex = 0;
        $scope.questionIndex = 0;
    }
    console.log("Question: "+ $scope.questionIndex + ", Slide: " + $scope.slideIndex);
    
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
    
    $http.get('/competition/'+$scope.competitionId+'/questions').then(function(resp) {
        $scope.questions = resp.data;
        if($scope.questions.length > 0){
            $scope.currQuestion = $scope.questions[$scope.questionIndex];
            $scope.currSlide = $scope.currQuestion.slides[$scope.slideIndex];
        }
    });

}]);
