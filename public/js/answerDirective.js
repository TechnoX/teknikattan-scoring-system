app.directive("answer", function(){
    return {
        templateUrl: "/template/answer.html",
        restrict: "E",
        scope: {
            view: '=',
            answer: '=',
            currentOnly: '='
        }
    }
});
