app.directive("projector", function(){
    return {
        templateUrl: "/template/projector.html",
        restrict: "E",
        scope: {
            view: '=',
        }
    }
});
