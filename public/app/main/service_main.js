app.factory('mainService', function($http) {

    return {

        getUsers: function() {
            return $http.get(api_url + '/user/get-users');
        }

    }
});
