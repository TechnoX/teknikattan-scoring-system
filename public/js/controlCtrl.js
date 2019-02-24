app.controller('controlCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    
    var socket = io();
    
    var competition_id = $routeParams.id;
    $scope.next = function(){
        var msg = {}
        msg.competition = competition_id;
        socket.emit('next', msg);
        return false;
    }
    $scope.previous = function(){
        var msg = {};
        msg.competition = competition_id;
        socket.emit('prev', msg);
        return false;
    }
    
    var audio = new Audio('/doorbell.wav');
    socket.on('timesUp', function(msg){
        // Not affecting this page
        if(msg.competition != competition_id)
            return;
        
        console.log("Times up!");
        audio.play();
    });

    
    socket.on('view_changed', function(msg){
        // Not affecting this page
        if(msg !== competition_id){
            return;
        }
        
        $http.get('/competition/'+competition_id+'/currentView').then(function(resp) {
            $scope.currView = resp.data;
        });
        
        $http.get('/competition/'+competition_id+'/previousView').then(function(resp) {
            $scope.prevView = resp.data;
        });
        
        $http.get('/competition/'+competition_id+'/nextView').then(function(resp) {
            $scope.nextView = resp.data;
        }); 
        
    });

    $http.get('/competition/'+competition_id+'/currentView').then(function(resp) {
        $scope.currView = resp.data;
    });
    
    $http.get('/competition/'+competition_id+'/previousView').then(function(resp) {
        $scope.prevView = resp.data;
    });
    
    $http.get('/competition/'+competition_id+'/nextView').then(function(resp) {
        $scope.nextView = resp.data;
    });
    
}]);
