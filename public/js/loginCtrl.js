app.controller('loginCtrl', ['$scope', '$http', function($scope, $http){

    $scope.data = {};
    $scope.data.username = "";
    $scope.data.password = "";
    
    
    $scope.logout = function(){
        localStorage.removeItem('t8_token');
        $scope.isAuthenticated = false;
        alert("Du har loggats ut!");
    }
 
    $scope.login = function(){
        $http.post("/api/login", $scope.data).then(function(res) {
            if(res.data.success){
                localStorage.setItem("t8_token", res.data.token);
                $scope.isAuthenticated = true;
                console.log("Logged in", res.data);
            }
        }, function(res){
            console.log("Failed", res.data);
            alert("Fel inloggningsuppgifter!");
        });
    }
}]);

