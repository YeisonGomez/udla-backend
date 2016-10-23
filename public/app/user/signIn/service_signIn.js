app.factory('signInUserService', function($http) {

    return {
        signup: function(usr) {
            return $http.post(api_url + '/sign-up', usr);
        },

        delete: function(id){
        	return $http.delete(api_url + '/user/delete/' + id);
        }

    }
});
