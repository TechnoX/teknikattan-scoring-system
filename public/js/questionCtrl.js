app.controller('questionCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    var _index = 0;
    var socket = io();
    $scope.state = "start";
    $scope.timesUp = false;
    $scope.slideIndex = 0;
    
    console.log("Params are: ", $location.search());
    // On judge view we load several IDs
    $scope.teams = $location.search()['teams'];

    $scope.team = {id: 1, name: "Testlag", scores: []};
    
    // If we have specified a team ID in the URL, fetch the team data from the backend
    if($location.search()['team']){
        $scope.team.id = $location.search()['team'];
        // Get the team matching the ID given in the url bar
        $http.get('/team/'+$location.search()['team']).then(function(resp) {
            if(resp.data){
                $scope.team = resp.data;
                console.log("Set team to ", $scope.team);
            }
        });
    }
    $scope.$watch('answer', function(newValue, oldValue, scope) {
        // If the new value is not updated, just re-assigned, do not save it
        if(newValue === undefined || newValue.length == 0)
            return;
        $http.post("/answer/"+$scope.team.id, {'team': $scope.team.id, 'question': _index, 'answers': newValue}).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när svaret skulle sparas!");
            console.log(res);
        });
    }, true);

    $http.get('/answer/'+$scope.team.id).then(function(resp) {
        if(resp.data.answers){
            $scope.answer = resp.data.answers;
        }else{
            $scope.answer = [];
        }
        console.log("answer",$scope.answer);
    });

    $http.get('/currentState').then(function(resp) {
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
                $http.get('/answer/'+$scope.team.id).then(function(resp) {
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
