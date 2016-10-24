app.run(['$rootScope', '$location', '$auth',
    function($rootScope, $location, $auth) {

        if($auth.getPayload() != undefined && $rootScope.user_module == undefined){
            $rootScope.user_module = $auth.getPayload().module.split(",")[0];
        }
        $rootScope.$on('routeSegmentChange', function(event, route) {

            if (route.segment != null && route.segment.name === "login") {
                var payload = $auth.getPayload();

                if (payload && payload !== undefined && payload.name.length > 3) {
                    if ($rootScope.user_module == "event" || $rootScope.user_module == "radio") {
                        event.preventDefault();
                        $location.path('/events');
                    } else if ($rootScope.user_module == "admin") {
                        event.preventDefault();
                        $location.path('/admin');
                    } else {
                        event.preventDefault();
                        $location.path('/news');
                    }
                }
            } else { // Cuando esta dentro de la app
                if (!$auth.isAuthenticated()) { //No existe un token el localStorage
                    event.preventDefault();
                    $location.path('/login');
                } else {
                    if ($auth.getPayload() !== undefined) {
                        var user = $auth.getPayload();

                        if (user.name.length > 3 && user.email.length > 3 && user.module.length > 1) {
                            $rootScope.user = $auth.getPayload();
                            if ($rootScope.user_module == "event" || $rootScope.user_module == "radio") {
                                event.preventDefault();
                                $location.path('/events');
                            } else if ($rootScope.user_module == "admin") {
                                event.preventDefault();
                                $location.path('/admin');
                            } else {
                                event.preventDefault();
                                $location.path('/news');
                            }

                        } else {
                            event.preventDefault();
                            $location.path('/login');
                        }
                    } else { // cuando el token no existe
                        //  $rootScope.user = undefined;
                        // event.preventDefault();
                        //$location.path('/login');
                    }

                }
            }
        });
    }
]);
