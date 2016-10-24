app.factory('signInUserService', function($http) {

    return {
        signup: function(usr) {
            return $http.post(api_url + '/sign-up', usr);
        },

        delete: function(id){
        	return $http.delete(api_url + '/user/delete/' + id);
        },

        deleteModule: function(user_id, module){
        	return $http.delete(api_url + '/user/delete-module/' + user_id + "/" + module);
        },

        addModule: function(user_id, module){
        	return $http.post(api_url + '/user/add-module', {id: user_id, mod: module});
        },

        setPassword: function(id, pass){
        	return $http.post(api_url + '/user/set-password', {id: id, pass: pass});	
        }

    }
});
