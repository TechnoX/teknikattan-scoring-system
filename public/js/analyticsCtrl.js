app.controller('analyticsCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var socket = io();
    var competition_id = $routeParams.id;
    
    $scope.teams = [];
    $http.get('/api/competition/'+competition_id+'/teams').then(function(resp) {
        if(resp.data){
            $scope.teams = resp.data;
            console.log("Set teams to ", $scope.teams);
        }
    });
    
    $http.get('/api/competition/'+competition_id+'/questions').then(function(resp) {
        $scope.questions = resp.data;
        for(var i = 0; i < $scope.questions.length; i++){
            if($scope.questions[i].type == "normal"){
                $scope.questions[i].state = "question";
            }else if($scope.questions[i].type == "truefalse"){
                $scope.questions[i].state = "statements";
            }else{
                $scope.questions[i].state = $scope.questions[i].type;
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
    
}]);
