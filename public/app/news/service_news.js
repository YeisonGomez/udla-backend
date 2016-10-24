app.factory('newsService', function($http) {

    return {
        create: function(news, mod) {
            return $http.post(api_url + '/new/create', {n: news, m: mod});
        },

        delete: function(id, module) {
            return $http.delete(api_url + '/new/delete/' + id + '/' + module);
        },

        getAllMe: function(module){
        	return $http.post(api_url + '/new/get-all-me', {module: module});
        }
    }
});
    