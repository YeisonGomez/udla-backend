app.controller('loginCtrl', function($scope, $rootScope, loginService, $auth, $location) {
    $scope.username = "";
    $scope.password = "";

    $scope.credentialsValid = function() {
        return ($scope.username.length >= 4 && $scope.password.length >= 2);
    }

    $scope.loader = false;
    $scope.login = function(ev) {
        if (!$scope.loader) {
            $scope.loader = true;
            if ($scope.credentialsValid()) {
                $auth.login({
                        email: $scope.username,
                        password: $scope.password
                    })
                    .then(function(data) {
                        if (data.data.state == "OK") {
                            $scope.username = "";
                            $scope.password = "";
                            localStorage.setItem("token", data.data.token);
                            $rootScope.user = $auth.getPayload();
                            $rootScope.user_module = $auth.getPayload().module.split(",")[0];
                            if ($rootScope.user.module == "news" || $rootScope.user.module == "wellness" || $rootScope.user.module == "youth") {
                                $location.path("#/news");
                            } else {
                                $location.path("#/events");
                            }
                        } else {
                            $scope.showAlert(ev, "Lo sentimos", data.data.message);
                        }
                        $scope.loader = false;
                    })
                    .catch(function(err) {
                        if (err.data != undefined && err.data.state != undefined && err.data.state == "error") {
                            $scope.showAlert(ev, "Lo sentimos", err.data.message);
                        } else {
                            $scope.showAlert(ev, "Lo sentimos", "La conexión con el servidor fallo");
                        }
                        $scope.loader = false;
                    });
            } else {
                alert("you shall not pass");
            }
        }

    }

});
