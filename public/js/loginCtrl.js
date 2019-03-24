app.controller('loginCtrl', ['$scope', '$http', function($scope, $http){
    $scope.logout = function(){
        localStorage.removeItem('t8_token');
        $scope.isAuthenticated = false;
        alert("Du har loggats ut!");
    }
        
    $scope.login = function(){
        $http.post("/login", {username: $scope.username, password: $scope.password}).then(function(res) {
            if(res.data.success){
                localStorage.setItem("t8_token", res.data.token);
                console.log("response", res.data);
            }
        }, function(res){
            console.log(res.data);
            alert("Fel inloggningsuppgifter!");
        });
    }
}]);

