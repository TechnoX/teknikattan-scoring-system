app.controller('controlCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    
    var socket = io();

    $scope.next = function(){
        socket.emit('next', 'no message');
        return false;
    }

    var audio = new Audio('/doorbell.wav');
    socket.on('timesUp', function(msg){
        console.log("Times up!");
        audio.play();
    });

}]);
