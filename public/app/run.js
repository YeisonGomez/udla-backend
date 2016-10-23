app.run(['$rootScope', '$location', '$auth',
    function($rootScope, $location, $auth) {
        $rootScope.$on('routeSegmentChange', function(event, route) {
            if (route.segment != null && route.segment.name === "login") {
                var payload = $auth.getPayload();

                if (payload && payload !== undefined && payload.name.length > 3) {
                    if (payload.module == "event" || payload.module == "radio") {
                        event.preventDefault();
                        $location.path('/events');
                    } else if (payload.module == "admin") {
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
                            if ($rootScope.user.module == "event" || $rootScope.user.module == "radio") {
                                event.preventDefault();
                                $location.path('/events');
                            } else if ($rootScope.user.module == "admin") {
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
