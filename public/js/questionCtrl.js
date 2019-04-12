app.controller('questionCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var socket = io();
    var competition_id = $routeParams.id;
    
    $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
        $scope.currView = resp.data;
    });

    socket.on('view_changed', function(msg){
        // Not affecting this page
        if(msg !== competition_id){
            return;
        }
        $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
            $scope.currView = resp.data;
        });
    });

    socket.on('time', function(msg){
        // Not affecting this page
        if(msg.competition !== competition_id)
            return;
        $scope.$applyAsync(function () {
            $scope.currView.time = msg.time;
        });
    });
}]);
