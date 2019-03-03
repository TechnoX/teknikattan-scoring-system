app.controller('neweditorCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.competitionId = parseInt($routeParams.id);
    $scope.slideIndex = parseInt($routeParams.slide);
    
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
    case 'settings':
        $scope.medium = "settings";
        break;
    }
    $scope.showTimeline = false;
    $scope.totalLength = 21; // Current number of slides in total for all questions
    $scope.nextDown = {'projector': 'competitor', 'competitor': 'answer', 'answer': 'settings'};
    $scope.nextUp = {'settings': 'answer', 'answer': 'competitor', 'competitor': 'projector'};



    $http.get('/competition/'+$scope.competitionId+'/questions').then(function(resp) {
        $scope.questions = resp.data;
        if($scope.questions.length > 0){
            $scope.currQuestion = $scope.questions[0];
            $scope.currSlide = $scope.currQuestion.slides[0];
        }
    });

}]);
