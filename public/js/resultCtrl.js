app.controller('resultCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    var socket = io();
    
    console.log("Params are: ", $location.search());
    // On judge view we load several IDs
    $scope.teamIds = $location.search()['teams'];
    $scope.teams = [];
    for(var t = 0; t < $scope.teamIds.length; t++){
        // Get the team matching the ID given in the url bar
        $http.get('/team/'+$scope.teamIds[t]).then(function(resp) {
            if(resp.data){
                $scope.teams.push(resp.data);
                console.log("Set team to ", resp.data);
            }
        });
    }

    $scope.getTotalScore = function(team){
        var total = 0;
        for(var t = 0; t < team.scores.length; t++){
            total += team.scores[t];
        }
        return total;
    }

    
    socket.on('scoring', function(msg){
        console.log("Got scoring msg: ", msg);
        $scope.$apply(function () {
            for(var t = 0; t < $scope.teams.length; t++){
                if(msg.id == $scope.teams[t].id){
                    $scope.teams[t].scores = msg.scores;
                    console.log("Update score for team ", $scope.teams[t].name);
                }
            }
            console.log($scope.teams);
        });
    });

    
}]);
