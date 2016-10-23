app.factory('newsService', function($http) {

    return {
        create: function(news) {
            return $http.post(api_url + '/new/create', news);
        },

        delete: function(id, module) {
            return $http.delete(api_url + '/new/delete/' + id + '/' + module);
        },

        getAllMe: function(){
        	return $http.post(api_url + '/new/get-all-me');
        }
    }
});
    