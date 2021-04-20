app.controller('questionCtrl', ['$scope', '$http', '$routeParams', '$sce', function($scope, $http, $routeParams, $sce){
    var socket = io();
    var competition_id = $routeParams.id;
    
    $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
        $scope.currView = resp.data;
        $scope.currView.textProjector = $sce.trustAsHtml($scope.currView.textProjector);
        if($scope.currView.answer){
            $scope.currView.answer.text = $sce.trustAsHtml($scope.currView.answer.text);
        }
        $scope.currView.textLeft = $sce.trustAsHtml($scope.currView.textLeft);
        $scope.currView.textRight = $sce.trustAsHtml($scope.currView.textRight);
    });

    socket.on('view_changed', function(msg){
        // Not affecting this page
        if(msg !== competition_id){
            return;
        }
        $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
            $scope.currView = resp.data;
            $scope.currView.textProjector = $sce.trustAsHtml($scope.currView.textProjector);
            if($scope.currView.answer){
                $scope.currView.answer.text = $sce.trustAsHtml($scope.currView.answer.text);
            }
            $scope.currView.textLeft = $sce.trustAsHtml($scope.currView.textLeft);
            $scope.currView.textRight = $sce.trustAsHtml($scope.currView.textRight);
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

    var audio = new Audio('/doorbell.wav');
    socket.on('timesUp', function(msg){
        // Not affecting this page
        if(msg.competition != competition_id)
            return;
        console.log("Times up!");
        audio.play();
    });

}]);
