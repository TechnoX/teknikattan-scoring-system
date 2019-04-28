app.controller('managementCtrl', ['$scope', '$http', '$routeParams', '$uibModal', function($scope, $http, $routeParams, $uibModal){

    var compId = $routeParams.id;

    
    $scope.showImages = true;
    $scope.showVideos = true;
    $scope.showLoose = false;
    
    $scope.competitions = [];
    $scope.teams = [];
    $http.get('/api/competitions').then(function(resp) {
        $scope.competitions = resp.data;

        // If we should get a specific competition
        if(compId){
            for(var i = 0; i < $scope.competitions.length; i++){
                if($scope.competitions[i]._id == compId){
                    $scope.comp = $scope.competitions[i];
                    $http.get('/api/competition/'+compId+'/teams').then(function(resp) {
                        $scope.teams = resp.data;
                    });
                    break;
                }
            }
        }
    });

    $scope.users = [];
    $http.get('/api/users').then(function(resp) {
        $scope.users = resp.data;
    });

    $scope.cities = [];
    $http.get('/api/cities').then(function(resp) {
        $scope.cities = resp.data;
        $scope.newCity = $scope.cities[0]._id;
    });

    $scope.images = [];
    $http.get('/api/media').then(function(resp) {
        $scope.images = resp.data;
    });

    
    $scope.editImage = function (img) {
        console.log(img);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/template/image_modal.html',
            controller: 'ImageModalCtrl',
            size: 'lg',
            resolve: {
                image: function () {
                    return img;
                },
                images: function () {
                    return $scope.images;
                },
            }
        });
    };
    
    $scope.editPassword = function(user){
        user.password = prompt("Ange nytt lösenord för " + user.name);
        updateUser(user);
    }
    $scope.editUser = function(user){
        console.log(user);
        updateUser(user);
    }
    $scope.removeUser = function(user){
        if(confirm("Vill du verkligen ta bort " + user.name)){
            removeUser(user);
            $scope.users = $scope.users.filter(x => x._id !== user._id);
        }
    }
    
    $scope.addUser = function(){
        for(var i = 0; i < $scope.users.length; i+=1){
            if($scope.users[i].name == $scope.newName){
                alert($scope.newName + " finns redan. Välj ett annat namn.");
                return;
            }
        }
        var password = prompt("Ange lösenord för ny användare")
        var newUser = {name: $scope.newName, city: $scope.newCity, password: password};
        addUser(newUser, function(err, id){
            if(err)return;
            newUser._id = id;
            $scope.users.push(newUser);
            $scope.newName = "";
            $scope.newCity = $scope.cities[0]._id;
        });
        
    }
    
    $scope.removeCity = function(city){
        if(confirm("Vill du verkligen ta bort " + city.name)){
            removeCity(city);
            $scope.cities = $scope.cities.filter(x => x._id !== city._id);
        }
    }
    
    $scope.editCity = function(city){
        console.log(city);
        updateCity(city);
    }

    $scope.addCity = function(){
        for(var i = 0; i < $scope.cities.length; i+=1){
            if($scope.cities[i].name == $scope.newName){
                alert($scope.newName + " finns redan. Välj ett annat namn.");
                return;
            }
        }
        var newCity = {name: $scope.newName};
        addCity(newCity, function(err, id){
            if(err)return;
            newCity._id = id;
            $scope.cities.push(newCity);
            $scope.newName = "";
        });
    }

    $scope.getCity = function(id){
        var city = $scope.cities.find(x => x._id === id);
        if(city){
            return city.name;
        }else{
            return "Okänd stad, rapportera fel till Fredrik Löfgren";
        }
    }
    
    $scope.editCompetition = function(comp){
        console.log(comp);
        comp.lastEdited = (new Date()).toISOString();
        updateCompetition(comp);
    }
    
    $scope.removeCompetition = function(comp){
        if(confirm("Vill du verkligen ta bort " + comp.name)){
            removeCompetition(comp);
            $scope.competitions = $scope.competitions.filter(x => x._id !== comp._id);
        }
    }
    
    $scope.cloneCompetition = function(comp){
        var newComp;
        newComp = angular.copy(comp);
        newComp.lastEdited = (new Date()).toISOString();
        newComp._id = undefined;
        addCompetition(newComp, comp._id, function(err, id){
            if(err)return;
            newComp._id = id;
            $scope.competitions.push(newComp);
        });
    }
    
    $scope.addCompetition = function(){
        var newComp = {name: $scope.newName, city: $scope.newCity, lastEdited: (new Date()).toISOString(), index: 0};
        addCompetition(newComp, undefined, function(err, id){
            if(err)return;
            newComp._id = id;
            $scope.competitions.push(newComp);
            $scope.newName = "";
            $scope.newCity = $scope.cities[0]._id;
        });        
    }


    $scope.removeTeam = function(team){
        if(confirm("Vill du verkligen ta bort " + team.name)){
            removeTeam(team);
            $scope.teams = $scope.teams.filter(x => x._id !== team._id);
        }
    }
    $scope.editTeam = function(team){
        console.log(team);
        updateTeam(team);
    }
    $scope.addTeam = function(){
        var newTeam = {competition: compId, name: "", scores: [], answers: []}
        addTeam(newTeam, function(err, team){
            if(err)return;
            $scope.teams.push(team);
        });
    }


    
    function updateUser(user){
        console.log("User ", user, " updated");
        $http.put('/api/user', user).then(function(res){
            // Do nothing
        }, function(res){
            alert("Något gick fel när användaren skulle uppdateras!");
        });
    }
    function removeUser(user){
        console.log("User ", user, " removed");
        $http.delete("/api/user/"+user._id).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när användaren skulle tas bort!");
            console.log(res);
        });
    }
    function addUser(user,callback){
        console.log("User ", user, " added");
        $http.post("/api/user", user).then(function(res) {
            callback(false, res.data);
        }, function(res){
            alert("Något gick fel när användaren skulle läggas till!");
            console.log(res);
            callback(true);
        });
    }

    function updateCity(city){
        $http.put('/api/city', city).then(function(res){
            // Do nothing
        }, function(res){
            alert("Något gick fel när staden skulle uppdateras!");
        });
    }
    function removeCity(city){
        $http.delete("/api/city/"+city._id).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när staden skulle tas bort!");
            console.log(res);
        });
    }
    function addCity(city, callback){
        $http.post("/api/city", city).then(function(res) {
            callback(false, res.data);
        }, function(res){
            alert("Något gick fel när staden skulle läggas till!");
            console.log(res);
            callback(true);
        });
    }

    function updateCompetition(comp){
        $http.put('/api/competition', comp).then(function(res){
            // Do nothing
        }, function(res){
            alert("Något gick fel när tävlingen skulle uppdateras!");
        });
    }
    function removeCompetition(comp){
        $http.delete("/api/competition/"+comp._id).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när tävlingen skulle tas bort!");
            console.log(res);
        });
    }
    function addCompetition(comp, from, callback){
        var data = {info: comp};
        if(from){
            data.cloned_from = from;
        }
        $http.post("/api/competition", data).then(function(res) {
            callback(false, res.data);
        }, function(res){
            alert("Något gick fel när tävlingen skulle läggas till!");
            console.log(res);
            callback(true);
        });
    }

    function updateTeam(team){
        $http.put('/api/team', team).then(function(res){
            // Do nothing
        }, function(res){
            alert("Något gick fel när laget skulle uppdateras!");
        });
    }
    function removeTeam(team){
        $http.delete("/api/team/"+team._id).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när laget skulle tas bort!");
            console.log(res);
        });
    }
    function addTeam(team, callback){
        $http.post("/api/team", team).then(function(res) {
            callback(false, res.data);
        }, function(res){
            alert("Något gick fel när laget skulle läggas till!");
            console.log(res);
            callback(true);
        });
    }
    
    
}]);
