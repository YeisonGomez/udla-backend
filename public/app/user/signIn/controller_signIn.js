app.controller('signInCtrl', function($scope, $rootScope, $location, signInUserService) {

    $scope.modules = [
        //{ name: "Eventos", key: "event" },
        { name: "Noticias Generales", key: "news" },
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
                        $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor falló");
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
    var repit2 = false;
    $scope.addModule = function(ev, user_id, mod) {
        if (!repit2) {
            repit2 = true;
            var ok = true;
            for (var i = 0; i < $rootScope.usr.modules.length; i++) {
                if ($rootScope.usr.modules[i].mod == mod) {
                    ok = false
                    break;
                }
            }
            if (ok) {
                $scope.loadingContent = true;
                signInUserService.addModule(user_id, mod)
                    .then(function(data) {
                        $rootScope.usr.modules.push({ detail: data.data.message, mod: mod });
                        for (var i = 0; i < $scope.users.length; i++) {
                            if (user_id == $scope.users[i].id) {
                                $scope.users[i].modulesSee.push({ module: mod, mod_spa: data.data.message });
                            }
                        }
                        $scope.loadingContent = false;
                        repit2 = false;
                    })
                    .catch(function(err) {
                        if (err.data.state == "error") {
                            $scope.showAlert(ev, "Lo sentimos", err.data.message);
                        } else {
                            $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor fallo");
                        }
                        $scope.loadingContent = false;
                        repit2 = false;
                    });
            } else {
                $scope.showAlert(ev, "Lo sentimos", "El usuario ya pertenece a este módulo");
                repit2 = false;
            }
        }
    }

    $scope.deleteModule = function(ev, user_id, mod, index) {
        $scope.loadingContent = true;
        signInUserService.deleteModule(user_id, mod)
            .then(function(data) {
                $rootScope.usr.modules[index] = undefined;
                for (var i = 0; i < $scope.users.length; i++) {
                    if (user_id == $scope.users[i].id) {
                        $scope.users[i].modulesSee[index] = undefined;
                    }
                }
                $scope.loadingContent = false;
            })
            .catch(function(err) {
                if (err.data.state == "error") {
                    $scope.showAlert(ev, "Lo sentimos", err.data.message);
                } else {
                    $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor fallo");
                }
                $scope.loadingContent = false;
            });
    }

    $scope.setPassword = function(ev, user_id, new_password) {
        $scope.showAlert(ev, "Confirmar", "¿Estas seguro de cambiar la contraseña?", function() {
            signInUserService.setPassword(user_id, new_password)
                .then(function(data) {
                    $rootScope.usr.password = "";
                    $scope.showAlert(ev, "Exito", "La contraseña fue cambiada");
                })
                .catch(function(err) {
                    if (err.data.state == "error") {
                        $scope.showAlert(ev, "Lo sentimos", err.data.message);
                    } else {
                        $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor fallo");
                    }
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
        $rootScope.editUser = false;
    }

    $scope.reset();
});
