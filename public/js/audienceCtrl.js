app.controller('audienceCtrl', ['$scope', '$http', function($scope, $http){
    var socket = io();
    
    socket.on('scoring', function(msg){
        console.log("Got scoring msg: ", msg);
        $scope.$apply(function () {
            if(msg._id == $scope.team._id){
                $scope.team.scores = msg.scores;
                console.log("Update score for team ", $scope.team.name);
            }
        });
    });
}]);
