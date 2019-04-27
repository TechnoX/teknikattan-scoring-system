app.controller('ImageModalCtrl', function ($scope, $uibModalInstance, image, images) {
    console.log(image);
    $scope.image = image;

    
    $scope.images = [];
    $http.get('/api/competitions/media/'+image.src).then(function(resp) {
        $scope.competitions = resp.data;
    });


    
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

