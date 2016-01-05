/**
 * Created by Yolanda G E on 9/13/2015.
 */
'use strict';

angular.module('yoprojectAngularApp')
  .directive('expectedEntry', function () {
    return {
      restrict: "E",
      replace: true,
      scope: {
        id: '=',
        type: '=',
        name: '=',
        value: '='
      },
      templateUrl: '../views/' + 'expectedEntry.html',
      controller: 'ExpectedEntryDirectiveCtrl'
    }
  });
