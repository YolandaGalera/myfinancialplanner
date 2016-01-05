/**
 * Created by Yolanda G E on 7/28/2015.
 */

angular.module('yoprojectAngularApp').controller('AppContainerCtrl', ['$rootScope', '$route', '$scope', '$location', '$window', 'loginService', 'userService', 'calculatorSaveDataService', function ($rootScope, $route, $scope, $location, $window, loginService, userService, expectedSituationService) {
    $rootScope.route = $route;
    $scope.loginStatus = loginService.loginStatus;
    $scope.user = userService.getUser();
    $scope.title = 'Calculator';
    $scope.styleAppContainer = null;

    var windowObject = angular.element($window);
    $scope.getWindowDimensions = function () {
        return {
            'h': windowObject.height(),
            'w': windowObject.width()
        };
    };

    windowObject.bind('resize', function () {
        $scope.$apply();
    });

    $scope.initUser = function () {
        userService.loadUserIfNeeded().then(function (user) {
            loginService.setIsLogged(true);
            if (!_.isUndefined(user)) {
                expectedSituationService.loadExpectedSituation();
            }        
        });
    };

    $scope.goAccountSettings = function () {
        $location.path('/account');
    };

    //$scope.$watch(function(){return $location.path()}, function(newPath){
    //  console.log('new path', newPath);
    //  if(_.contains(newPath, 'instantEntry')){
    //    $scope.title = 'NEW ENTRY';
    //    return;
    //  }
    //  if(_.contains(newPath, 'dailySituation')){
    //    $scope.title = 'NEW DAY ENTRY';
    //    return;
    //  }
    //  if(_.contains(newPath, 'yearlyOverview')){
    //    $scope.title = 'YEARLY OVERVIEW';
    //    return;
    //  }
    //  if(_.contains(newPath, 'balanceDetail')){
    //    $scope.title = 'DETAILED BALANCE';
    //    return;
    //  }
    //  if(_.contains(newPath, 'account')){
    //    $scope.title = 'ACCOUNT SETTINGS';
    //    return;
    //  }
    // $scope.title = 'EXPECTATIONS';
    //})
    $scope.$watch($scope.getWindowDimensions, function (value) {
        var topTitle = 50;
        if ($scope.loginStatus.isLogged)
            $scope.styleAppContainer = Math.floor((value.h - topTitle) / value.h * 100) - 1 + '%';
    }, true);

    $scope.$watch(function () { return $scope.loginStatus.isLogged; }, function (isLogged) {
        var topTitle = 50;
        if (isLogged) {
            var value = $scope.getWindowDimensions();
            $scope.styleAppContainer = Math.floor((value.h - topTitle) / value.h * 100) - 1 + '%';
            return;
        }
        $scope.styleAppContainer = '100%';
    }, true);

    function init() {
        $scope.initUser();
    }

    init();
}]);
