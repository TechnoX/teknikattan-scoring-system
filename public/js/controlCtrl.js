app.controller('controlCtrl', ['$scope', '$http', '$routeParams', '$document', function($scope, $http, $routeParams, $document){
    
    var socket = io();
    $scope.timerStarted = false;

    $document.bind('keydown', function (e) {
        console.log(e.key);
        switch (e.key) {
        case " ":
        case "ArrowRight":
        case "PageDown":
        case "Enter":
            $scope.next();
            return false;
            break;
        case "ArrowLeft":
        case "PageUp":
            $scope.previous();
            return false;
            break;
        }
    });
    
    var competition_id = $routeParams.id;
    $scope.next = function(){
        var msg = {}
        msg.competition = competition_id;
        socket.emit('next', msg);
        if($scope.currView.hasTimer && !$scope.timerStarted){
            $scope.timerStarted = true;
        }
    }
    $scope.previous = function(){
        var msg = {};
        $scope.timerStarted = false;
        msg.competition = competition_id;
        socket.emit('prev', msg);
    }
    
    var audio = new Audio('/doorbell.wav');
    socket.on('timesUp', function(msg){
        // Not affecting this page
        if(msg.competition != competition_id)
            return;
        console.log("Times up!");
        audio.play();
    });
    socket.on('time', function(msg){
        // Not affecting this page
        if(msg.competition !== competition_id)
            return;

        $scope.$applyAsync(function () {
            $scope.currView.time = msg.time;
        });
    });

    
    socket.on('view_changed', function(msg){
        // Not affecting this page
        if(msg !== competition_id){
            return;
        }
        $scope.timerStarted = false;
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
