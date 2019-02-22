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
