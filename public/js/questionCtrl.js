app.controller('questionCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var _index = 0;
    var socket = io();
    $scope.state = "start";
    $scope.timesUp = false;
    $scope.slideIndex = 0;

    var competition_id = $routeParams.id;
    
    $http.get('/competition/'+competition_id+'/currentView').then(function(resp) {
        if(!resp.data.question){
            $scope.currQuestion = null;
        }else{
            $scope.currQuestion = resp.data.question;
            $scope.currSlide = resp.data.question.slides[resp.data.slideIndex];
            $scope.slideIndex = resp.data.slideIndex;
            $scope.hintIndex = resp.data.hintIndex;
            $scope.statementIndex = resp.data.statementIndex;
            _index = resp.data.questionIndex;
        }
        $scope.state = resp.data.state;
        console.log(resp.data.state);
    });
    

    
    socket.on('stateChange', function(msg){
        $scope.$applyAsync(function () {
            if(!msg.question){
                $scope.currQuestion = null;
            }else{
                $scope.currQuestion = msg.question;
                $scope.currSlide = msg.question.slides[msg.slideIndex];
                $scope.slideIndex = msg.slideIndex;
                $scope.hintIndex = msg.hintIndex;
                $scope.statementIndex = msg.statementIndex;
                _index = msg.questionIndex;
            }
            $scope.state = msg.state;

            // If new question loaded ... 
            if(msg.state == 'image'){
                // ... get associated answers
                $http.get('/competition/'+competition_id+'/answer/'+$scope.team.id).then(function(resp) {
                    if(resp.data.answers){
                        $scope.answer = resp.data.answers;
                    }else{
                        $scope.answer = [];
                    }
                    console.log("answer",$scope.answer);
                });
                $scope.timesUp = false;
            }
            if(msg.state == 'hints' || msg.state == 'statements'){
                $scope.timesUp = false;
            }
            if($scope.currSlide.hasTimer && msg.state != 'beforeanswer' && msg.state != 'answer'){
                $scope.timesUp = false;
            }
            console.log(msg.state);
        });
    });
    socket.on('time', function(msg){
        $scope.$applyAsync(function () {
            $scope.currSlide.time = msg;
        });
    });
    
    socket.on('timesUp', function(msg){
        $scope.$applyAsync(function () {
            console.log("Times up!");
            // Lås tidigare fält så man inte kan mata in mer
            $scope.timesUp = true;
        });
    });
    
    $scope.index = function(){return _index + 1;};
}]);
