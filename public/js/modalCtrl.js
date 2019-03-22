// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, question) {
    $scope.answer = question.answer;
    $scope.question = question;
    $scope.tinymceOptions = {
        plugins: 'image media paste contextmenu textpattern lists',
        menubar: 'edit insert',
        toolbar: 'bold italic image numlist bullist',
        forced_root_block : false,
        paste_data_images: true
    };



    $scope.removeHint = function(index){
        $scope.question.hints.splice(index, 1);
    }
    $scope.removeStatement = function(index){
        $scope.question.statements.splice(index, 1);
    }
    $scope.removeQuiz = function(index){
        $scope.question.quiz.splice(index, 1);
    }
    $scope.addHint = function(){
        $scope.question.hints.push('');
    }
    $scope.addStatement = function(){
        $scope.question.statements.push('');
    }
    $scope.addQuiz = function(){
        $scope.question.quiz.push({question: '', A: '', B: '', C: '', D: ''});
    }


    
    $scope.remove = function(array, index){
        array.splice(index, 1);
    }

    $scope.add = function(array, subquestion, length){
        if(subquestion){
            array.push({type: 'text', label: "Delfråga "+(array.length+1), alternatives: [], multiple: false, show: Array(length).fill(true)});
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

