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
        console.log("Send data: ", $scope.data);
        $http.post("/login", $scope.data).then(function(res) {
            if(res.data.success){
                localStorage.setItem("t8_token", res.data.token);
                $scope.isAuthenticated = true;
                console.log("response", res.data);
            }
        }, function(res){
            console.log(res.data);
            alert("Fel inloggningsuppgifter!");
        });
    }
}]);

