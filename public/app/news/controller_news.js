app.controller('newsCtrl', function($scope, $rootScope, $location, $interval, newsService, Upload) {
    $rootScope.new = {
        subject: "",
        detail: "",
        content: ""
    };
    $scope.init();
    $scope.message;

    $scope.create = function(ev) {
        $rootScope.new.content = JSON.stringify($scope.quill.getContents());
        if (!$scope.loadingContent && $scope.validNew()) {
            if ($scope.form.file.$valid && $scope.file || $rootScope.edit) {
                $scope.loadingContent = true;
                Upload.upload({
                    url: api_url + '/new/create',
                    data: { file: $scope.file, n: $rootScope.new, m: $rootScope.user_module }
                }).then(function(data) {
                    if ($scope.newsTotal == undefined) {
                        $scope.newsTotal = data.data.message;
                    } else {
                        $scope.newsTotal.push(data.data.message);
                    }
                    $rootScope.new = {
                        subject: "",
                        detail: "",
                        content: ""
                    };
                    $scope.file = undefined;
                    $scope.articleNew();
                    $scope.loadingContent = false;

                }, function(resp) {
                    console.log('Error status: ');
                    console.log(resp);
                    $scope.loadingContent = false;
                    $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor falló");
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                }).catch(function(err) {
                    $scope.loadingContent = false;
                    $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor falló");
                });
            } else {
                $scope.showAlert(ev, "Lo sentimos", "Por favor suba una imagen de portada");
            }
        } else {
            if ($rootScope.new.subject.length >= 80 || $rootScope.new.detail.length >= 200) {
                $scope.showAlert(ev, "Lo sentimos", "El título es demasiado largo para ser publicado.");
            } else {
                $scope.showAlert(ev, "Lo sentimos", "El articulo es demasiado corto para ser publicado o no tiene contenido");
            }
        }
    }

    $scope.delete = function(ev) {
        $scope.showAlert(ev, "Confirmar", "¿Estas seguro de eliminar el articulo?", function() {
            $scope.loadingContent = true;
            newsService.delete($rootScope.new.id, $rootScope.user_module).then(function(data) {
                    $scope.deleteList(data.data.message);
                    $scope.articleNew();
                    $scope.loadingContent = false;
                    $rootScope.edit = false;
                })
                .catch(function(err) {
                    $scope.loadingContent = false;
                    $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor fallo");
                });
        });

    }

    $scope.update = function(ev) {
        $rootScope.new.content = JSON.stringify($scope.quill.getContents());
        $scope.loadingContent = true;
        newsService.update($rootScope.new).then(function(data) {
                console.log(data.data);
                $scope.loadingContent = false;
            })
            .catch(function(err) {
                $scope.loadingContent = false;
                $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor falló");
            });
    }

    $scope.validNew = function() {
        return ($rootScope.new.subject.length > 3 && $rootScope.new.subject.length <= 80 && $rootScope.new.detail.length > 4 && $rootScope.new.detail.length <= 200 && $rootScope.new.content.length > 5);
    }

});
