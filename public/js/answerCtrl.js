app.directive('multipleChoices', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            // How view values will be saved in the model
            ngModel.$parsers.push(function(value) {
                var text = "";
                var arr = document.getElementsByName(attrs.name);
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].checked)
                        text += ";" + arr[i].value;
                }
                text = text.substring(1);
                return text;
            });
            // How model values will appear in the view
            ngModel.$formatters.push(function(value) {
                // TODO: Attrs.value is always undefined when page loads since value has not have had time to update before this is ran
                //console.log("formatter value: '" + value + "'");
                //console.log("attrs value: '" + attrs.value + "'");
                if(value === undefined || value === null)
                    return false;
                //console.log(value.split(";"))
                //console.log(value.split(";").indexOf(attrs.value));
                return value.split(";").indexOf(attrs.value) != -1;
            });
        }
    };
});


app.directive('stringToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(value) {
                return '' + value;
            });
            ngModel.$formatters.push(function(value) {
                return parseFloat(value);
            });
        }
    };
});



app.directive('setFocus', function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.setFocus);
            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    };
});



app.controller('answerCtrl', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout){
    var socket = io();
    var competition_id = $routeParams.id;
    var team_id = $routeParams.team;
    $scope.timesUp = false;
    console.log("Beginning");;
    $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
        $scope.view = resp.data;
        console.log(resp.data);
        if($scope.view.answer.type == "pairing"){
            $timeout(function() {
                loadDragDrop($scope.view.answer.pairs);
            });
        }
    });
    $http.get('/api/competition/'+competition_id+'/timesup').then(function(resp) {
        $scope.timesUp = resp.data;
        console.log(resp.data);
    });

    
    socket.on('view_changed', function(msg){
        // Not affecting this page
        if(msg !== competition_id){
            return;
        }
        $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
            $scope.view = resp.data;
            console.log(resp.data);
            if($scope.view.state == 'beforeanswer' || $scope.view.state == 'answer'){
                $scope.timesUp = true;
            }else{
                $scope.timesUp = false;
            }
            if($scope.view.answer.type == "pairing"){
                $timeout(function() {
                    loadDragDrop($scope.view.answer.pairs);
                });
            }   
        });
    });

    socket.on('timesUp', function(msg){
        // Not affecting this page
        if(msg.competition != competition_id)
            return;
        console.log("Times up!");
        $scope.$applyAsync(function () {
            $scope.timesUp = true;
        });
    });
    
    
    // Get the team matching the ID given in the url bar
    $http.get('/api/team/'+team_id).then(function(resp) {
        if(resp.data){
            $scope.team = resp.data;
            console.log("Set team to ", $scope.team);
        }
    });

        
    $scope.$watch('team.answers', function(newValue, oldValue, scope) {
        // If the new value is not updated, just re-assigned, do not save it
        if(!$scope.view || newValue === undefined || newValue.length == 0)
            return;
        console.log("Save: ", newValue);
        $http.post("/api/competition/"+competition_id+"/answer/"+team_id, {'team': team_id, 'question': $scope.view.number, 'answers': newValue}).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när svaret skulle sparas!");
            console.log(res);
        });
    }, true);

    function loadDragDrop(pairs) {
        jsPlumb.setContainer(document.getElementById("foo"));


        for(var i = 0; i < pairs[0].alternatives.length; i++){
            jsPlumb.makeSource(pairs[0].alternatives[i], {
                anchor:"Continuous",
                endpoint:["Rectangle", { width:40, height:20 }],
                maxConnections: pairs[0].multiple ? -1 : 1
            });
        }

        for(var i = 0; i < pairs[1].alternatives.length; i++){
            jsPlumb.makeTarget(pairs[1].alternatives[i], {
                anchor:"Continuous",
                endpoint:["Rectangle", { width:40, height:20 }],
                maxConnections: pairs[1].multiple ? -1 : 1
            });
        }

        return;
        var endpointOptions = { isSource:true, isTarget:true }; 
        var window3Endpoint = jsPlumb.addEndpoint('Bil', { anchor:"Right" }, endpointOptions);
        var window4Endpoint = jsPlumb.addEndpoint('Vatten', { anchor:"Left" }, endpointOptions);
        console.log("Körs detta?");
        //jsPlumb.connect({ source: document.getElementById("Bil"), target: document.getElementById("Vatten") });

        jsPlumb.connect({ 
            source:window3Endpoint,
            target:window4Endpoint,
            connector: [ "Bezier", { curviness: 75} ],
            paintStyle:{ strokeWidth:25, stroke:'yellow' }
        });
    
    }

}]);
