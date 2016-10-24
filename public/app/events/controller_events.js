app.controller('eventsCtrl', function($scope, $rootScope, $location, $mdDialog) {

    $scope.showAlert = function(ev) {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Ha ocurrido un error')
            .textContent('Mini explicación del error.')
            .ariaLabel('error')
            .ok('Got it!')
            .targetEvent(ev)
        );
    };
});
