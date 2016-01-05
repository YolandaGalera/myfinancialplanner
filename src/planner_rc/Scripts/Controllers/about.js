'use strict';

/**
 * @ngdoc function
 * @name yoprojectAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the yoprojectAngularApp
 */
angular.module('yoprojectAngularApp')
  .controller('AboutCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
