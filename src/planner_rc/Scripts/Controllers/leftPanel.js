/**
 * Created by Yolanda G E on 27/06/2015.
 */
'use strict';
angular.module('yoprojectAngularApp')
  .controller('LeftPanelCtrl', ['$scope', '$location', 'loginService', function ($scope, $location, loginService) {
      $scope.goMain = function () {
          $location.path('/');
      };

      $scope.goYearlyOverview = function () {
          $location.path('/yearlyOverview');
      };

      $scope.goDailySituation = function () {
          $location.path('/dailySituation');
      };

      $scope.goInstantEntry = function () {
          $location.path('/instantEntry');
      };

      $scope.goAccount = function () {
          $location.path('/account');
      };

      $scope.logout = function () {
          loginService.logout();
          loginService.setIsLogged(false);
          $location.path('/login');
      }
  }]);



