app.controller('answerCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var competition_id = $routeParams.id;

    // On judge view we load several IDs
    $scope.teams = [];
    $http.get('/competition/'+competition_id+'/teams').then(function(resp) {
        if(resp.data){
            $scope.teams = resp.data;
            console.log("Set teams to ", $scope.teams);
        }
    });    
    
    $scope.team = {id: 1, name: "Testlag", scores: []};
    
    // If we have specified a team ID in the URL, fetch the team data from the backend
    if($routeParams.team){
        $scope.team.id = $routeParams.team;
        // Get the team matching the ID given in the url bar
        $http.get('/team/'+$routeParams.team).then(function(resp) {
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
        $http.post("/competition/"+competition_id+"/answer/"+$scope.team.id, {'team': $scope.team.id, 'question': _index, 'answers': newValue}).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när svaret skulle sparas!");
            console.log(res);
        });
    }, true);

    $http.get('/competition/'+competition_id+'/answer/'+$scope.team.id).then(function(resp) {
        if(resp.data.answers){
            $scope.answer = resp.data.answers;
        }else{
            $scope.answer = [];
        }
        console.log("answer",$scope.answer);
    });
    
}]);
