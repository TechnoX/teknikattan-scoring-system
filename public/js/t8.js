var app = angular.module('t8', ['ui.tinymce', 'ngSanitize', 'ngFileUpload','ui.bootstrap']);



app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);




app.controller('UploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {
    // upload on file select or drop
    $scope.upload = function (file) {
        console.log("Start upload", file);
        if(!file)// If the file is not valid (null), don't upload
            return
        Upload.upload({
            url: '/upload',
            data: {file: file}
        }).then(function (resp) {
            if(resp.data.success){
                var path = resp.data.path;
                $scope.$parent.$parent.currQuestion.image = path;
                console.log('Success uploaded. Response: ', path);
            }
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
}]);

app.controller('competitionsCtrl', ['$scope', '$uibModal', '$http', function ($scope, $uibModal, $http) {
    $scope.competitions = [
        {id: 23, name: "Regionsemifinal 1", teams:['Skolgårda skola', 'Berzeliusskolan', 'Södervärnsskolan']},
        {id: 36, name: "Regionsemifinal 2", teams:['Sjöängsskolan', 'Malmlättsskolan', 'Hultdalskolan']},
        {id: 74, name: "Regionfinal", teams:['Sjöängsskolan', 'Skolgårda skola', 'Berzeliusskolan']},
        {id: 92, name: "Riksfinal", teams:['IFM', 'MAI', 'IDA']}
    ];



}]);
app.controller('editorCtrl', ['$scope', '$uibModal', '$http', function ($scope, $uibModal, $http) {
    
    $scope.open = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/template/answer_modal.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                question: function () {
                    return $scope.currQuestion;
                }
            }
        });

        modalInstance.result.then(function (answer) {
            console.info('Modal okayed at: ' + new Date());
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };

    
    $scope.questions = [];
    $scope.currQuestion = null;
    $scope.currSlide = null;

    $http.get('/questions').then(function(resp) {
        $scope.questions = resp.data;
        if($scope.questions.length > 0){
            $scope.currQuestion = $scope.questions[0];
            $scope.currSlide = $scope.currQuestion.slides[0];
        }
    });

    $scope.save = function(question){
        if(!$scope.correct()){
            return false;
        }
        $http.put('/questions', $scope.questions).then(function(res){
            alert("Allting sparades korrekt!");
            console.log(res);
        }, function(res){
            alert("Något gick fel när frågorna skulle sparas!");
            console.log(res);
        });
    }

    $scope.correct = function(){
        for(var i = 0; i < $scope.questions.length; i++){
            if($scope.questions[i].type == 'hints' || $scope.questions[i].type == 'truefalse'){
                if(!$scope.questions[i].slides[$scope.questions[i].slides.length - 1].hasTimer){
                    alert("Sista sliden för fråga " + (i+1) + " måste ha en timer, eftersom frågan är en ledtråds- eller sant/falskt-fråga.");
                    console.log("Sista sliden för fråga " + (i+1) + " måste ha en timer, eftersom frågan är en ledtråds- eller sant/falskt-fråga.");
                    return false;
                }
            }
        }
        return true;
    }
    $scope.index = function(question){
        var index = -1;
        $scope.questions.some(function(obj, i) {
            return obj === question ? index = i : false;
        });
        return index+1;
    }
    $scope.changeSlide = function(question,slide){
        $scope.currQuestion=question;
        $scope.currSlide=slide;
    }
    $scope.removeSlide = function(question,slide){
        if(question.slides.length == 1){
            var questionIndex = $scope.index(question) - 1;

            // Only update current viewed question if it was the deleted one
            if(question === $scope.currQuestion){
                // If this was the last question, take the one before, otherwise the one after
                if(questionIndex == $scope.questions.length - 1){
                    // Question before
                    $scope.currQuestion = $scope.questions[questionIndex - 1];
                    // If we remove the last existing slide?
                    if(!$scope.currQuestion){
                        $scope.currSlide = null;
                    }else{
                        // Last slide in this new question
                        $scope.currSlide = $scope.currQuestion.slides[$scope.currQuestion.slides.length - 1];
                    }
                }else{
                    // Question after
                    $scope.currQuestion = $scope.questions[questionIndex + 1];
                    // First slide in this new question
                    $scope.currSlide = $scope.currQuestion.slides[0];
                }
            }
            $scope.questions.splice(questionIndex, 1);
        }else{
            var slideIndex = question.slides.indexOf(slide);
            
            // Only update current viewed slide if it was the deleted one
            if(slide === $scope.currSlide){
                // If this was the last slide, take the one before, otherwise the one after
                if(slideIndex == question.slides.length - 1){
                    $scope.currSlide = question.slides[slideIndex - 1];
                }else{
                    $scope.currSlide = question.slides[slideIndex + 1];
                }
            }
            question.slides.splice(slideIndex, 1);
        }
    }
    
    $scope.addQuestion = function () {
        var index = $scope.index($scope.currQuestion);
        var question = {title: "TitelPåFråga",
                        type: "normal",
                        hints: [],
                        statements: [],
                        image: "/images/dummy.jpg",
                        timeText: "? minuter",
                        scoringText: "? poäng per rätt svar",
                        maxScoringText: "Totalt ? poäng",
                        answer: {type: 'multi', pairs: [[],[]], subQuestions: []},
                        slides: [
                            {hasTimer: true, time: 2*60, textLeft: "<p></p>", textRight: "<p></p>", textProjector: "<p></p>"}
                        ]
                       };
        $scope.questions.splice(index, 0, question);
        $scope.currQuestion = $scope.questions[index];
        $scope.currSlide = $scope.currQuestion.slides[0];
    };

    $scope.addSlide = function () {
        var slide = {hasTimer: true, time: 2*60, textLeft: "<p></p>", textRight: "<p></p>", textProjector: "<p></p>"};
        var index = $scope.currQuestion.slides.indexOf($scope.currSlide) + 1;
        $scope.currQuestion.slides.splice(index, 0, slide);
        $scope.currSlide = $scope.currQuestion.slides[index];
    };
    
    $scope.editOptions = {
        theme: 'inlite',
        plugins: 'image media table paste contextmenu textpattern lists',
        insert_toolbar: 'image quicktable media',
        selection_toolbar: 'bold italic | list bullist',
        inline: true,
        forced_root_block : false,
        paste_data_images: true,
        content_css: []
    };
    
    
    $scope.range = function(n) {
        return new Array(n);
    };

}]);



app.directive("competitor", function() {
    return {
        templateUrl: "/template/competitor.html",
        restrict: "E",
        scope: {
            slide: '=',
            question: '=',
            editable: '=',
            state: '=',
            hintIndex: '@',
            statementIndex: '@'
        },
        link: function(scope) {
            scope.removeHint = function(index){
                scope.question.hints.splice(index, 1);
            }
            scope.removeStatement = function(index){
                scope.question.statements.splice(index, 1);
            }
            scope.addHint = function(){
                scope.question.hints.push('');
            }
            scope.addStatement = function(){
                scope.question.statements.push('');
            }
        }
    }
});


app.directive("projector", function(){
    return {
        templateUrl: "/template/projector.html",
        scope: {
            slide: '=',
            question: '=',
            editable: '=',
            state: '=',
            hintIndex: '@',
            statementIndex: '@'
        },
        restrict: "E"
    }
});



// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, question) {
    $scope.answer = question.answer;
    $scope.question = question;
    $scope.tinymceOptions = {
        plugins: 'image media paste contextmenu textpattern lists',
        menubar: 'edit insert',
        toolbar: 'bold italic  image numlist bullist',
        forced_root_block : false,
        paste_data_images: true
    };
    
    $scope.remove = function(array, index){
        array.splice(index, 1);
    }

    $scope.add = function(array, subquestion,length){
        if(subquestion){
            array.push({type: 'text', alternatives: [], multiple: false, show: Array(length).fill(true)});
        }else{
            array.push('');
        }
    }
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.answer);
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


app.controller('questionCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    var _index = 0;
    var socket = io();
    $scope.state = "start";
    $scope.timesUp = false;
    $scope.slideIndex = 0;
    
    console.log("Params are: ", $location.search());
    // On judge view we load several IDs
    $scope.teams = $location.search()['teams'];

    $scope.team = {id: 1, name: "Testlag", scores: []};
    
    // If we have specified a team ID in the URL, fetch the team data from the backend
    if($location.search()['team']){
        $scope.team.id = $location.search()['team'];
        // Get the team matching the ID given in the url bar
        $http.get('/team/'+$location.search()['team']).then(function(resp) {
            if(resp.data){
                $scope.team = resp.data;
                console.log("Set team to ", $scope.team);
            }
        });
    }
    $scope.$watch('answer', function(newValue, oldValue, scope) {
        // If the new value is not updated, just re-assigned, do not save it
        if(newValue === undefined || newValue.length == 0)
            return;
        $http.post("/answer/"+$scope.team.id, {'team': $scope.team.id, 'question': _index, 'answers': newValue}).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när svaret skulle sparas!");
            console.log(res);
        });
    }, true);

    $http.get('/answer/'+$scope.team.id).then(function(resp) {
        if(resp.data.answers){
            $scope.answer = resp.data.answers;
        }else{
            $scope.answer = [];
        }
        console.log("answer",$scope.answer);
    });

    $http.get('/currentState').then(function(resp) {
        if(!resp.data.question){
            $scope.currQuestion = null;
        }else{
            $scope.currQuestion = resp.data.question;
            $scope.currSlide = resp.data.question.slides[resp.data.slideIndex];
            $scope.slideIndex = resp.data.slideIndex;
            $scope.hintIndex = resp.data.hintIndex;
            $scope.statementIndex = resp.data.statementIndex;
            _index = resp.data.questionIndex;
        }
        $scope.state = resp.data.state;
        console.log(resp.data.state);
    });
    

    
    socket.on('stateChange', function(msg){
        $scope.$applyAsync(function () {
            if(!msg.question){
                $scope.currQuestion = null;
            }else{
                $scope.currQuestion = msg.question;
                $scope.currSlide = msg.question.slides[msg.slideIndex];
                $scope.slideIndex = msg.slideIndex;
                $scope.hintIndex = msg.hintIndex;
                $scope.statementIndex = msg.statementIndex;
                _index = msg.questionIndex;
            }
            $scope.state = msg.state;

            // If new question loaded ... 
            if(msg.state == 'image'){
                // ... get associated answers
                $http.get('/answer/'+$scope.team.id).then(function(resp) {
                    if(resp.data.answers){
                        $scope.answer = resp.data.answers;
                    }else{
                        $scope.answer = [];
                    }
                    console.log("answer",$scope.answer);
                });
                $scope.timesUp = false;
            }
            if(msg.state == 'hints' || msg.state == 'statements'){
                $scope.timesUp = false;
            }
            if($scope.currSlide.hasTimer){
                $scope.timesUp = false;
            }
            console.log(msg.state);
        });
    });
    socket.on('time', function(msg){
        $scope.$applyAsync(function () {
            $scope.currSlide.time = msg;
        });
    });
    
    socket.on('timesUp', function(msg){
        $scope.$applyAsync(function () {
            console.log("Times up!");
            // Lås tidigare fält så man inte kan mata in mer
            $scope.timesUp = true;
        });
    });
    
    $scope.index = function(){return _index + 1;};
}]);



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



app.directive('imgPreload', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        scope: {
            ngSrc: '@'
        },
        link: function(scope, element, attrs) {
            element.on('load', function() {
                element.removeClass('hide');
            }).on('error', function() {
                //
            });

            scope.$watch('ngSrc', function(newVal) {
                element.addClass('hide');
            });
        }
    };
}]);


app.controller('judgeCtrl', ['$scope', '$http', function($scope, $http){
    var socket = io();
    $scope.answer = [];
    $scope.team = {id: $scope.teamId};

    $http.get('/team/'+$scope.teamId).then(function(resp) {
        if(resp.data){
            $scope.team = resp.data;
            console.log("Set team to ", $scope.team);
        }
    });
        

    $scope.getTotalScore = function(){
        var total = 0;
        for(var t = 0; t < $scope.team.scores.length; t++){
            total += $scope.team.scores[t];
        }
        return total;
    }
    
    $scope.$watch('team.scores', function(newValue, oldValue, scope) {
        // If the new value is not updated, just re-assigned, do not save it
        if(newValue === undefined || newValue.length == 0)
            return;
        
        $http.post("/scores/"+$scope.team.id, {'team': $scope.team.id, 'scores': newValue}).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när poängen skulle sparas!");
            console.log(res);
        });
    }, true);
    
    $http.get('/answer/'+$scope.team.id).then(function(resp) {
        if(resp.data.answers){
            $scope.answer = resp.data.answers;
        }else{
            $scope.answer = [];
        }
        console.log("answer",$scope.answer);
    });

    
    socket.on('answer', function(msg){
        if(msg.team == $scope.team.id){
            $scope.$applyAsync(function () {
                $scope.answer = msg.answers;
                console.log("answer", msg.answer);
            });
        }
    });


}]);



app.controller('resultCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    var socket = io();
    
    console.log("Params are: ", $location.search());
    // On judge view we load several IDs
    $scope.teamIds = $location.search()['teams'];
    $scope.teams = [];
    for(var t = 0; t < $scope.teamIds.length; t++){
        // Get the team matching the ID given in the url bar
        $http.get('/team/'+$scope.teamIds[t]).then(function(resp) {
            if(resp.data){
                $scope.teams.push(resp.data);
                console.log("Set team to ", resp.data);
            }
        });
    }


    
    socket.on('scoring', function(msg){
        console.log("Got scoring msg: ", msg);
        $scope.$apply(function () {
            for(var t = 0; t < $scope.teams.length; t++){
                if(msg.id == $scope.teams[t].id){
                    $scope.teams[t].scores = msg.scores;
                    console.log("Update score for team ", $scope.teams[t].name);
                }
            }
            console.log($scope.teams);
        });
    });

    
}]);

/*

app.directive('highlighter', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            model: '=highlighter'
        },
        link: function(scope, element) {
            scope.$watch('model', function (nv, ov) {
                if (nv !== ov) {
                    // apply class
                    element.addClass('highlight');

                    // auto remove after some delay
                    $timeout(function () {
                        element.removeClass('highlight');
                    }, 1000);
                }
            });
        }
    };
}]);
*/
