app.controller('mainCtrl', function($rootScope, $scope, $location, newsService, mainService) {
    $rootScope.edit = false;
    $rootScope.editUser = false;
    $scope.loadingMenu = true;
    $scope.loadingContent = false;

    if($rootScope.user != undefined){
        if ($rootScope.user.module != "admin") {
            newsService.getAllMe().then(function(data) {
                    $scope.newsTotal = data.data.message;
                    $scope.loadingMenu = false;
                })
                .catch(function(err) {
                    console.log(err);
                    $scope.loadingMenu = false;
                });
        } else {
            mainService.getUsers().then(function(data) {
                $scope.users = data.data.message;
                $scope.loadingMenu = false;
            }).catch(function(err) {
                $scope.loadingMenu = false;
            });
        }
    }

    //admin
    $scope.notice = function(newd, index) {
        $rootScope.edit = true;
        $rootScope.new = newd;
        $scope.quill.setContents(JSON.parse(newd.content));
    }

    $scope.articleNew = function() {
        $rootScope.edit = false;
        $rootScope.new = {
            subject: "",
            detail: "",
            content: ""
        };
        $scope.erase();
    }

    $scope.deleteList = function(id) {
        var m = [];
        for (var i = 0; i < $scope.newsTotal.length; i++) {
            if ($scope.newsTotal[i].id != id) {
                m.push($scope.newsTotal[i]);
            }
        }
        $scope.newsTotal = m;
    }


    $scope.logout = function() {
        localStorage.clear();
        $location.path('/login');
    }

    $scope.init = function() {
        $scope.quill = new Quill('#editor-container', {
            modules: {
                toolbar: [
                    ['bold', 'italic'],
                    [{ 'align': [] }],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
                    ['link', 'blockquote', 'code-block', 'image', 'header'],
                    [{ list: 'ordered' }, { list: 'bullet' }]
                ]
            },
            placeholder: 'Contenido del artículo...',
            theme: 'snow'
        });
    }

    $scope.erase = function() {
        $scope.quill.setContents([
            { insert: '' }
        ]);
    }

    //superadmin

    $scope.userDetail = function(usr) {
        $rootScope.usr = usr;
        $rootScope.editUser = true;
    }

    $scope.deleteListUser = function(id) {
        var u = [];
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].id != id) {
                u.push($scope.users[i]);
            }
        }
        $scope.users = u;
    }

});
