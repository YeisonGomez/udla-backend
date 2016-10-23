app.directive('regularCard', function() {
    return {
        restrict: 'E',
        templateUrl: '/app/directives/views/regularCard.html',
        scope: {
        	redirect: '&',
            name: '@',
            id: '@'
        }
        
    }
});
