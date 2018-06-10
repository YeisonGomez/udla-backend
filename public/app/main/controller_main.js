app.controller('mainCtrl', function($rootScope, $scope, $location, newsService, mainService, $location, $routeSegment) {
    $rootScope.edit = false;
    $rootScope.editUser = false;
    $scope.loadingMenu = true;
    $scope.loadingContent = false;

    var see_notice_me = function() {
        newsService.getAllMe($rootScope.user_module).then(function(data) {
                $scope.newsTotal = data.data.message;
                $scope.loadingMenu = false;
            })
            .catch(function(err) {
                console.log(err);
                $scope.loadingMenu = false;
            });
    }

    var see_users = function(callback) {
        mainService.getUsers().then(function(data) {
            $scope.users = data.data.message;
            callback();
            $scope.loadingMenu = false;
        }).catch(function(err) {
            $scope.loadingMenu = false;
        });
    }

    if ($rootScope.user != undefined) {
        if ($rootScope.user_module != "admin") {
            see_notice_me();
        } else {
            see_users(function(){
                for (var i = 0; i < $scope.users.length; i++) {
                    var mod_sp = $scope.users[i].module_spanish.split(',');
                    var mod = $scope.users[i].module.split(',');
                    $scope.users[i].modulesSee = [];
                    for (var j = 0; j < mod.length; j++) {
                        $scope.users[i].modulesSee.push({module: mod[j], mod_spa: mod_sp[j]});   
                    }
                }
            });
        }

        var mod = $rootScope.user.module.split(",");
        var modetail = $rootScope.user.module_detail.split(",");
        $scope.modulesList = [];
        for (var i = 0; i < mod.length; i++) {
            $scope.modulesList.push({
                m: mod[i],
                ms: modetail[i]
            });
        }
    }

    $scope.setModule = function(mod) {
        if (mod != $rootScope.user_module) {
            var copy = $rootScope.user_module;
            $rootScope.user_module = mod;
            if (mod == "admin") {
                $routeSegment.chain[0].reload();
            }else{
                if(copy == "admin"){
                    $routeSegment.chain[0].reload();
                    $routeSegment.chain[1].reload();
                }   
                see_notice_me();
            }
        }
    }

    $scope.logout = function() {
        localStorage.clear();
        $location.path('/login');
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
            content: "",
            view_img: "",
            img: ""
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

    $scope.init = function() {
        $scope.quill = new Quill('#editor-container', {
            modules: {
                toolbar: [
                    ['bold', 'italic'],
                    ['link', 'header'],
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
        var modules = $rootScope.usr.module_spanish.split(',');
        var mod = $rootScope.usr.module.split(',');
        $rootScope.usr.modules = [];
        for (var i = 0; i < modules.length; i++) {
            $rootScope.usr.modules.push({detail: modules[i], mod: mod[i]});
        }
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
