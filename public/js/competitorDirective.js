app.directive("competitor", function() {
    return {
        templateUrl: "/template/competitor.html",
        restrict: "E",
        scope: {
            view: '=',
        }
    }
});
