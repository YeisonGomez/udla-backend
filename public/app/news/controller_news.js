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
            newsService.create($rootScope.new).then(function(data) {
                    $scope.newsTotal.push(data.data.message);
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
            newsService.delete($rootScope.new.id, $rootScope.user.module).then(function(data) {
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


/*Cargar imagen y convertirla a B64*/
$scope.data = {}; //init variable
    $scope.click = function() { //default function, to be override if browser supports input type='file'
      $scope.data.alert = "Su navegador no soporta HTML5 para la carga de imagenes"
    }

    var fileSelect = document.createElement('input'); //input it's not displayed in html, I want to trigger it form other elements
    fileSelect.type = 'file';

    if (fileSelect.disabled) { //check if browser support input type='file' and stop execution of controller
      return;
    }
  
      $scope.upImg = function() { //activate function to begin input file on click
        fileSelect.click();
      }

      fileSelect.onchange = function() { //set callback to action after choosing file
        var f = fileSelect.files[0], r = new FileReader();

        r.onloadend = function(e) { //callback after files finish loading
          $scope.data.b64 = e.target.result;
          $scope.$apply();
          console.log($scope.data.b64.replace(/^data:image\/(png|jpg);base64,/, "")); //replace regex if you want to rip off the base 64 "header"

          //here you can send data over your server as desired
        }

        r.readAsDataURL(f); //once defined all callbacks, begin reading the file

      };

      console.log($scope.data.b64); //scope con la imagen codificada

    
  });
