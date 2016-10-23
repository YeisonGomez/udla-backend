app.controller('signInCtrl', function($scope, $rootScope, $location, signInUserService) {

    $scope.modules = [
        //{ name: "Eventos", key: "event" },
        { name: "Noticias", key: "news" },
        { name: "Educación continuada", key: "education" },
        //{ name: "Emisora", key: "radio" },
        { name: "Bienestar Universitario", key: "wellness" },
        { name: "Extensión social", key: "youth" },
        { name: "Convenios", key: "agreement" },
        { name: "Graduados", key: "graduate" }
    ]

    $scope.create = function(ev) {
        if ($scope.validForm()) {
            signInUserService.signup($rootScope.usr).then(function(data) {
                    $scope.users.push(data.data.message);
                    $scope.reset();
                })
                .catch(function(err) {
                    if (err.data.state == "error") {
                        $scope.showAlert(ev, "Lo sentimos", err.data.message);
                    } else {
                        $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor fallo");
                    }
                });
        } else {
            $scope.showAlert(ev, "Lo sentimos", "Complete los campos obligatorios");
        }
    }

    $scope.delete = function(ev) {
        $scope.showAlert(ev, "Confirmar", "¿Estas seguro de eliminar el usuario?", function() {
            $scope.loadingContent = true;
            signInUserService.delete($rootScope.usr.id)
                .then(function(data) {
                	$scope.reset();
                    $scope.deleteListUser(data.data.message);
                    $scope.loadingContent = false;
                    $rootScope.editUser = false;
                })
                .catch(function(err) {
                    if (err.data.state == "error") {
                        $scope.showAlert(ev, "Lo sentimos", err.data.message);
                    } else {
                        $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor fallo");
                    }
                    $scope.loadingContent = false;
                    $rootScope.editUser = false;
                });
        });
    }
    
    $scope.validForm = function() {
        $rootScope.usr.email = ($rootScope.usr.email == undefined) ? "" : $rootScope.usr.email;
        return $rootScope.usr.email.length > 4 && $rootScope.usr.name.length > 2 && $rootScope.usr.lastname.length > 2 && $rootScope.usr.module.length > 1;
    }

    $scope.reset = function() {
        $rootScope.usr = {
            id: "",
            email: "",
            password: "",
            name: "",
            lastname: "",
            module: "",
            date_signup: ""
        };
    }

    $scope.reset();
});
