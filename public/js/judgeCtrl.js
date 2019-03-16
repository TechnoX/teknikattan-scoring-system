app.controller('judgeCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var socket = io();
    var competition_id = $routeParams.id;

    $http.get('/competition/'+competition_id+'/currentView').then(function(resp) {
        $scope.view = resp.data;
        console.log(resp.data);
    });

    
    // On judge view we load several IDs
    $scope.teams = [];
    $http.get('/competition/'+competition_id+'/teams').then(function(resp) {
        if(resp.data){
            $scope.teams = resp.data;
            console.log("Set teams to ", $scope.teams);
            console.log($scope.teams);
            // Loads answers
            angular.forEach($scope.teams, function(team, index){
                $http.get('/competition/'+competition_id+'/answer/'+team._id).then(function(resp) {
                    console.log(team);
                    if(resp.data.answers){
                        team.answer = resp.data.answers;
                    }else{
                        team.answer = [];
                    }
                    console.log("answer", team.answer);
                });
            });
        }
    });
    
    $scope.getTotalScore = function(team){
        var total = 0;
        for(var t = 0; t < team.scores.length; t++){
            total += team.scores[t];
        }
        return total;
    }
    
    $scope.saveScoring = function(team){        
        $http.put("/team", team).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när poängen skulle sparas!");
            console.log(res);
        });
    }
    

    
    socket.on('answer', function(msg){
        angular.forEach($scope.teams, function(team, index){
            if(msg.team == team._id){
                $scope.$applyAsync(function () {
                    team.answer = msg.answers;
                    console.log("answer", msg.answers);
                });
            }
        });
    });
    socket.on('view_changed', function(msg){
        // Not affecting this page
        if(msg !== competition_id){
            return;
        }
        $http.get('/competition/'+competition_id+'/currentView').then(function(resp) {
            // ... get associated answers
            angular.forEach($scope.teams, function(team, index){
                $http.get('/competition/'+competition_id+'/answer/'+team._id).then(function(resp) {
                    if(resp.data.answers){
                        team.answer = resp.data.answers;
                    }else{
                        team.answer = [];
                    }
                    console.log("answer", team.answer);
                });
            });
            
            if(resp.data.state == 'beforeanswer' || resp.data.state == 'answer')
                return;
            $scope.view = resp.data;
        });
    });
}]);
