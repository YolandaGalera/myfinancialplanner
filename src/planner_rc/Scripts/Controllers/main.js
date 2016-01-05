'use strict';

/**
 * @ngdoc function
 * @name yoprojectAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yoprojectAngularApp
 */
angular.module('yoprojectAngularApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

