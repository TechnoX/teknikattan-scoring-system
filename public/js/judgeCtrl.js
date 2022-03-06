
app.filter("orderByArray",function(){
    return function(answers, pairs) {
        var ordered = [];

	answers.sort((a,b) => {
	    a_pair = a.split("&rarr;");
	    a_left = parseInt(a_pair[0].substring(4));
	    b_pair = b.split("&rarr;");
	    b_left = parseInt(b_pair[0].substring(4));
	    return a_left - b_left;
	})

	var ordered = [];
	for (const answer of answers){
	    pair = answer.split("&rarr;");
	    left =  parseInt(pair[0].substring(4));
	    right = parseInt(pair[1].substring(5));
	    ordered.push(pairs[0].alternatives[left] + "&rarr;" + pairs[1].alternatives[right]);
	}
	
        return ordered;
    };
});

app.controller('judgeCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var socket = io();
    var competition_id = $routeParams.id;

    $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
        $scope.view = resp.data;
        console.log(resp.data);
    });

    
    // On judge view we load several IDs
    $scope.teams = [];
    $http.get('/api/competition/'+competition_id+'/teams').then(function(resp) {
        if(resp.data){
            $scope.teams = resp.data;
            console.log("Set teams to ", $scope.teams);
        }
    });
    
    $scope.getTotalScore = function(team){
        var total = 0;
        for(var t = 0; t < team.scores.length; t++){
            total += team.scores[t];
        }
        return total;
    }
    
    $scope.saveScoring = function(team){        
        $http.put("/api/team", team).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när poängen skulle sparas!");
            console.log(res);
        });
    }
    

    
    socket.on('answer', function(msg){
        angular.forEach($scope.teams, function(team, index){
            if(msg.team == team._id){
                $scope.$applyAsync(function () {
                    team.answers = msg.answers;
                    console.log("answer", msg.answers);
                });
            }
        });
    });
    socket.on('view_changed', function(msg){
        // Not affecting this page
        if(msg !== competition_id){
            return;
        }
        $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
            if(resp.data.state == 'beforeanswer' || resp.data.state == 'answer')
                return;
            $scope.view = resp.data;
        });
    });
}]);
