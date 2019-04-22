app.controller('UploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {
    // upload on file select or drop
    $scope.upload = function (file) {
        console.log("Start upload", file);
        if(!file)// If the file is not valid (null), don't upload
            return
        Upload.upload({
            url: '/api/upload',
            data: {file: file, 'competition': $scope.$parent.$parent.currQuestion.competition}
        }).then(function (resp) {
            var path = resp.data.path;
            $scope.$parent.$parent.currQuestion.image = path;
            console.log('Success uploaded. Response: ', path);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
}]);
