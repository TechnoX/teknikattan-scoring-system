app.controller('ImageModalCtrl', function ($scope, $http, $uibModalInstance, image, images) {
    $scope.image = image;
    $scope.images = images;
    
    $scope.remove = function(img){
        if(confirm("Vill du verkligen ta bort bilden/videon?")){
            if(images.indexOf(img) >= 0){
                $http.delete("/api/media/"+img._id).then(function(res) {
                    $scope.images.splice(images.indexOf(img), 1);
                    $uibModalInstance.close($scope.image);
                }, function(res){
                    alert("Något gick fel när bilden/videon skulle tas bort!");
                    console.log(res);
                });
            }
        }
    }
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.image);
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

