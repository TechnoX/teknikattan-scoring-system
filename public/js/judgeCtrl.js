app.controller('judgeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    var socket = io();
    $scope.answer = [];
    if($location.search()['team']){
        // If we have specified a team ID in the URL, fetch the team data from the backend
        $scope.teamId = $location.search()['team'];
    }

    $scope.team = {id: $scope.teamId, scores: []};
    $http.get('/team/'+$scope.teamId).then(function(resp) {
        if(resp.data){
            $scope.team = resp.data;
            console.log("Set team to ", $scope.team);
        }
    });
    

    $scope.getTotalScore = function(){
        var total = 0;
        for(var t = 0; t < $scope.team.scores.length; t++){
            total += $scope.team.scores[t];
        }
        return total;
    }
    
    $scope.$watch('team.scores', function(newValue, oldValue, scope) {
        // If the new value is not updated, just re-assigned, do not save it
        if(newValue === undefined || newValue.length == 0)
            return;
        
        $http.post("/scores/"+$scope.team.id, {'team': $scope.team.id, 'scores': newValue}).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när poängen skulle sparas!");
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

    
    socket.on('answer', function(msg){
        if(msg.team == $scope.team.id){
            $scope.$applyAsync(function () {
                $scope.answer = msg.answers;
                console.log("answer", msg.answers);
            });
        }
    });
    socket.on('stateChange', function(msg){
        $scope.$applyAsync(function () {
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
            }
        });
    });
}]);
