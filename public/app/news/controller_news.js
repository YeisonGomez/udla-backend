app.controller('newsCtrl', function($scope, $rootScope, $location, $interval, newsService) {
    $rootScope.new = {
        subject: "",
        detail: "",
        content: ""
    };
    $scope.init();

    $scope.create = function(ev) {
        $rootScope.new.content = JSON.stringify($scope.quill.getContents());
        if (!$scope.loadingContent && $scope.validNew()) {
            $scope.loadingContent = true;
            newsService.create($rootScope.new, $rootScope.user_module).then(function(data) {
                    if($scope.newsTotal == undefined){
                        $scope.newsTotal = data.data.message;
                    }else{
                        $scope.newsTotal.push(data.data.message);
                    }
                    $rootScope.new = {
                        subject: "",
                        detail: "",
                        content: ""
                    };
                    $scope.articleNew();
                    $scope.loadingContent = false;
                })
                .catch(function(err) {
                    $scope.loadingContent = false;
                    $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor falló");
                });
        } else {
              
            if($rootScope.new.subject.length()<=50){
                $scope.showAlert(ev, "Lo sentimos", "El título es demasiado largo para ser publicado.");
            }else{
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
                    $rootScope.edit = false;
                });
        });

    }

    $scope.validNew = function() {
        return $rootScope.new.subject.length > 3 && $rootScope.new.detail.length > 4 && $rootScope.new.content.length > 5;
    }
    
  });
