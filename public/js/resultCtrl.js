app.directive('highlighter', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            model: '=highlighter'
        },
        link: function(scope, element) {
            scope.$watch('model', function (nv, ov) {
                if (nv !== ov) {
                    console.log("Highlight!");
                    // apply class
                    element.addClass('highlight');

                    // auto remove after some delay
                    $timeout(function () {
                        element.removeClass('highlight');
                    }, 3000);
                }
            });
        }
    };
}]);

app.controller('resultCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var socket = io();
    var competition_id = $routeParams.id;

    $scope.teams = [];
    $http.get('/competition/'+competition_id+'/teams').then(function(resp) {
        if(resp.data){
            $scope.teams = resp.data;
            console.log("Set teams to ", $scope.teams);
        }
    });
    

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
                if(msg.team == $scope.teams[t]._id){
                    $scope.teams[t].scores = msg.scores;
                    console.log("Update score for team ", $scope.teams[t].name);
                }
            }
        });
    });

    
}]);
