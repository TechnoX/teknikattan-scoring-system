app.controller('judgeCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var socket = io();
    
    $scope.teams = [];
    var competition_id = $routeParams.id;
    
    $http.get('/competition/'+competition_id+'/teams').then(function(resp) {
        if(resp.data){
            $scope.teams = resp.data;
            console.log("Set teams to ", $scope.teams);
            
            for(var t = 0; t < $scope.teams.length; t++){
                $http.get('/competition/'+competition_id+'/answer/'+$scope.teams[t].id).then(function(resp) {
                    if(resp.data.answers){
                        $scope.teams[t].answer = resp.data.answers;
                    }else{
                        $scope.teams[t].answer = [];
                    }
                    console.log("answer",$scope.teams[t].answer);
                });
            }

            
        }
    });
    

    $scope.getTotalScore = function(team){
        var total = 0;
        for(var t = 0; t < team.scores.length; t++){
            total += team.scores[t];
        }
        return total;
    }

    $scope.saveScore = function(team){
        $http.post("/competition/"+competition_id+"/scores/"+team.id, {'team': team.id, 'scores': team.scores}).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när poängen skulle sparas!");
            console.log(res);
        });
    }
    

    
    socket.on('answer', function(msg){
        for(var t = 0; t < $scope.teams.length; t++){
            if(msg.team == $scope.teams[t].id){
                $scope.$applyAsync(function () {
                    $scope.teams[t].answer = msg.answers;
                    console.log("answer", msg.teams[t].answers);
                });
            }
        }
    });
    socket.on('stateChange', function(msg){
        $scope.$applyAsync(function () {
            // If new question loaded ... 
            if(msg.state == 'image'){
                // ... get associated answers
                for(var t = 0; t < $scope.teams.length; t++){
                    $http.get('/competition/'+competition_id+'/answer/'+$scope.teams[t].id).then(function(resp) {
                        if(resp.data.answers){
                            $scope.teams[t].answer = resp.data.answers;
                        }else{
                            $scope.teams[t].answer = [];
                        }
                        console.log("answer",$scope.teams[t].answer);
                    });
                }
            }
        });
    });
}]);
