/**
 * Created by Yolanda G E on 8/2/2015.
 */

'use strict';

angular.module('yoprojectAngularApp')
  .controller('InstantEntryCtrl',['$scope', 'calculatorSaveDataService', function ($scope, calculatorSaveDataService) {
    $scope.entry = { date: new Date() };
    $scope.showSavedInstant = false;
    $scope.categories = calculatorSaveDataService.getExpectedExpenses().concat(calculatorSaveDataService.getExpectedIncome());

    $scope.saveInstantData = function(isValid) {
      if(!isValid){
        return;
      }
      calculatorSaveDataService.saveInstantData($scope.incomeFieldValue, $scope.entry.selectedCategory, $scope.entry.date);
      $scope.showSavedInstant = true;
    };
  }]);
