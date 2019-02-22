
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
