app.controller('managementCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){


    var id = $routeParams.id;
    
    $scope.competitions = [
        {id: 23, name: "Regionsemifinal 1", city: 0, lastEdited: new Date(2018,3,24,10,22), teams:[{id: 12, name: 'Skolgårda skola', scores: [0,0,0,0,0,0,0,0]}, {id: 11, name: 'Berzeliusskolan', scores: [0,0,0,0,0,0,0,0]}, {id: 10, name: 'Södervärnsskolan', scores: [0,0,0,0,0,0,0,0]}]},
        {id: 36, name: "Regionsemifinal 2", city: 0, lastEdited: new Date(2018,3,24,10,28), teams:[{id: 20, name: 'Sjöängsskolan', scores: [0,0,0,0,0,0,0,0]}, {id: 21, name: 'Malmlättsskolan', scores: [0,0,0,0,0,0,0,0]}, {id: 22, name: 'Hultdalskolan', scores: [0,0,0,0,0,0,0,0]}]},
        {id: 74, name: "Regionfinal", city: 1, lastEdited: new Date(2018,3,24,11,22), teams:[{id: 30, name: 'Sjöängsskolan', scores: [0,0,0,0,0,0,0,0]}, {id: 31, name: 'Skolgårda skola', scores: [0,0,0,0,0,0,0,0]}, {id: 32, name: 'Berzeliusskolan', scores: [0,0,0,0,0,0,0,0]}]},
        {id: 92, name: "Riksfinal", city: 1, lastEdited: new Date(2018,4,22,8,22), teams:[{id: 44, name: 'IFM', scores: [0,0,0,0,0,0,0,0]}, {id: 45, name: 'MAI', scores: [0,0,0,0,0,0,0,0]}, {id: 47, name: 'IDA', scores: [0,0,0,0,0,0,0,0]}]},
        {id: 24, name: "Interna mästerskapen", city: 3, lastEdited: new Date(2019,1,20,14,55), teams:[{id: 59, name: "Röde 2047", scores: [0,0,0,0,0,0,0,0]}, {id: 51, name: "Sami UU", scores: [0,0,0,0,0,0,0,0]}, {id: 58, name: "Peter LiU", scores: [0,0,0,0,0,0,0,0]}]}
    ];

    for(var i = 0; i < $scope.competitions.length; i++){
        if($scope.competitions[i].id == id){
            $scope.comp = $scope.competitions[i];
            break;
        }
    }
    
    $scope.cities = [{name: "Sverige", id: 0}, {name: "Linköping", id: 1}, {name: "Uppsala", id: 2}, {name: "Borlänge", id: 3}, {name: "Stockholm", id: 4}, {name: "Lund", id: 7} ];
    $scope.users = [{id: 0, name: "Fredrik", city: 0, password: "giraff"}, {id: 3, name: "Peter", city: 0, password: "retep"}, {id: 2, name: "Susanne", city: 1, password: "ennasus"}, {id: 7, name: "Röde", city: 3, password: "lego"}];
    
    $scope.editPassword = function(user){
        user.password = prompt("Ange nytt lösenord för " + user.name);
    }
    $scope.editUser = function(user){
        console.log(user);
    }
    $scope.removeUser = function(user){
        if(confirm("Vill du verkligen ta bort " + user.name)){
            $scope.users = $scope.users.filter(x => x.id !== user.id);
        }
    }
    
    $scope.addUser = function(){
        var password = prompt("Ange lösenord för ny användare")
        var max = {name: "asdf", id:-1};
        for(var i = 0; i < $scope.users.length; i+=1){
            if($scope.users[i].name == $scope.newName){
                alert($scope.newName + " finns redan. Välj ett annat namn.");
                return;
            }
            if($scope.users[i].id > max.id){
                max = $scope.users[i];
            }
        }
        $scope.users.push({name: $scope.newName, city: $scope.newCity, password: password, id: max.id+1});
        $scope.newName = "";
        $scope.newCity = 0;
    }
    
    $scope.removeCity = function(city){
        if(confirm("Vill du verkligen ta bort " + city.name)){
            $scope.cities = $scope.cities.filter(x => x.id !== city.id);
        }
    }
    
    $scope.editCity = function(city){
        console.log(city);
    }

    $scope.addCity = function(){
        var max = {name: "asdf", id:-1};
        for(var i = 0; i < $scope.cities.length; i+=1){
            if($scope.cities[i].name == $scope.newCity){
                alert($scope.newCity + " finns redan. Välj ett annat namn.");
                return;
            }
            if($scope.cities[i].id > max.id){
                max = $scope.cities[i];
            }
        }
        $scope.cities.push({name: $scope.newCity, id: max.id+1});
        $scope.newCity = "";
    }

    $scope.getCity = function(id){
        return $scope.cities.find(x => x.id === id).name;
    }
    
    $scope.editCompetition = function(comp){
        console.log(comp);
        comp.lastEdited = new Date();
    }
    
    $scope.removeCompetition = function(comp){
        if(confirm("Vill du verkligen ta bort " + comp.name)){
            $scope.competitions = $scope.competitions.filter(x => x.id !== comp.id);
        }
    }
    
    $scope.cloneCompetition = function(comp){
        var newComp;
        newComp = angular.copy(comp);
        newComp.lastEdited = new Date();
        newComp.id = 1 + Math.max.apply(Math, $scope.competitions.map(function(o) { return o.id; }));
        $scope.competitions.push(newComp);
    }
    
    $scope.addCompetition = function(){
        var max = Math.max.apply(Math, $scope.competitions.map(function(o) { return o.id; }));
        console.log(max)
        $scope.competitions.push({name: $scope.newName, city: $scope.newCity, lastEdited: new Date(), teams: [], id: max+1});
        $scope.newName = "";
        $scope.newCity = 0;
    }
    
}]);
