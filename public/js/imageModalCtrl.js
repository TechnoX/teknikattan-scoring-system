app.controller('ImageModalCtrl', function ($scope, $uibModalInstance, image, images) {
    $scope.image = image;
    $scope.images = images;
    
    $scope.remove = function(img){
        if(images.indexOf(img) >= 0){
            $scope.images.splice(images.indexOf(img), 1);
            $uibModalInstance.close($scope.image);
        }
    }
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.image);
    };
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

