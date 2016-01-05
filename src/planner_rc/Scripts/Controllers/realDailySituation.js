/**
 * Created by Yolanda G E on 28/06/2015.
 */
'use strict';

/**
 * @ngdoc function
 * @name yoprojectAngularApp.controller:RealSituationCtrl
 * @description
 * # RealDailySituationCtrl
 * Controller of the yoprojectAngularApp
 */
angular.module('yoprojectAngularApp')
  .controller('RealDailySituationCtrl', ['$scope', 'calculatorSaveDataService', 'calculatorSaveDailyRealSituationService', function ($scope, calculatorSaveDataService, calculatorSaveDailyRealSituationService) {
    $scope.dailyIncomeFields = calculatorSaveDataService.getIncomeFieldsWithoutValue();
    $scope.dailyExpensesFields = calculatorSaveDataService.getExpensesFieldsWithoutValue();
    $scope.dailyFields = $scope.dailyIncomeFields.concat($scope.dailyExpensesFields);
    $scope.daily = {date: new Date()};

    $scope.calculateDailyExpenses = function () {
      var total = calculateExpenses();
      return total;
    };

    $scope.calculateDailyBenefits = function () {
      var totalIncome = 0;
      $scope.dailyIncomeFields.forEach(function (dailyIncomeField) {
        totalIncome += dailyIncomeField.value;
      });
      var benefits = totalIncome - calculateExpenses();
      return benefits;
    };

    $scope.saveDailySituation = function () {
      calculatorSaveDailyRealSituationService.saveData($scope.dailyFields, $scope.daily.date);
      $scope.realDailySituationForm.$setPristine();
      $scope.dailyIncomeFields = calculatorSaveDataService.getIncomeFieldsWithoutValue();
      $scope.dailyExpensesFields = calculatorSaveDataService.getExpensesFieldsWithoutValue();
      $scope.daily = {date: new Date()};
    };

    $scope.$watchCollection('dailyIncomeFields', function (newDailyIncomes) {
      $scope.dailyFields = newDailyIncomes.concat($scope.dailyExpensesFields);
    });

    $scope.$watchCollection('dailyExpensesFields', function (newDailyExpenses) {
      $scope.dailyFields = $scope.dailyIncomeFields.concat(newDailyExpenses);
    });

    function calculateExpenses() {
      var totalExpenses = 0;
      $scope.dailyExpensesFields.forEach(function (dailyExpensesField) {
        totalExpenses += dailyExpensesField.value;
      });
      return totalExpenses;
    }
  }]);
