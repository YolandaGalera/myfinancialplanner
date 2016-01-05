/**
 * Created by Yolanda G E on 9/6/2015.
 */
'use strict';

angular.module('yoprojectAngularApp')
  .directive('balanceEntry', function () {
    return {
      restrict: "E",
      replace: true,
      scope: {
        id: '=',
        date: '=',
        name: '=',
        value: '=',
        format: '='
      },
      templateUrl: '../views/balanceEntry.html',
      controller: 'BalanceEntryDirectiveCtrl',
      link: function ($scope, $element) {
        var myElement = $element;
        $scope.removeThisElement = function () {
          myElement.remove();
        };
      }
    }
  });
