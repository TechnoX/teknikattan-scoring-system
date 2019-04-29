app.controller('UploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {
    // upload on file select or drop
    $scope.upload = function (file) {
        console.log("Start upload", file);
        if(!file)// If the file is not valid (null), don't upload
            return
        Upload.upload({
            url: '/api/upload',
            data: {file: file}
        }).then(function (resp) {
            if($scope.$parent.$parent.currQuestion){
                $scope.$parent.$parent.currQuestion.image = "uploads/" + resp.data.src;
            }else{
                resp.data.competitions = [];
                $scope.images.push(resp.data);
            }
            console.log('Success uploaded. Response: ', resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
}]);
