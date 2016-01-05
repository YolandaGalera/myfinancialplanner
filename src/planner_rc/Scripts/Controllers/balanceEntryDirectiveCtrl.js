/**
 * Created by Yolanda G E on 9/12/2015.
 */
'use strict';

angular.module('yoprojectAngularApp')
  .controller('BalanceEntryDirectiveCtrl', ['$rootScope', '$scope', '$modal', 'calculatorSaveDataService', 'yearlyOverviewService', function ($rootScope, $scope, $modal, calculatorSaveDataService, yearlyOverviewService) {
    $scope.disabled = false;
    $scope.edit = false;
    $scope.selectedCategory = {name: $scope.name};
    $scope.selection = {date: $scope.date};
    $scope.newValue = $scope.value;
    $scope.expectedExpenses = calculatorSaveDataService.getExpectedExpenses();
    $scope.expectedIncomes = calculatorSaveDataService.getExpectedIncome();
    $scope.modalInstance = undefined;

    if ($scope.format == 'weekly') {
      $scope.isWeek = true;
      $scope.weekOfYear = yearlyOverviewService.getWeek($scope.date);
    }

    $scope.getFormat = function() {
      if ($scope.format == 'monthly' || $scope.format == '') {
        $scope.isWeek = false;
        return 'yyyy-MM';
      }
      if ($scope.format == 'yearly') {
        $scope.isWeek = false;
        return 'yyyy';
      }
      if ($scope.format == 'daily') {
        $scope.isWeek = false;
        return 'yyyy-MM-dd';
      }
    };

    $scope.createEditableFields = function (event) {
      if (!$scope.disabled) {
        $scope.edit = true;
        $rootScope.$broadcast('CREATE_EDITABLE_FIELDS_CLICKED');
      }
      $scope.selectedCategory = {name: $scope.name};
      $scope.selection = {date: $scope.date};
      $scope.newValue = $scope.value;
    };

    $scope.cancelEdition = function (event) {
      if ($scope.edit) {
        $rootScope.$broadcast('CANCEL_EDITABLE_FIELDS');
        $scope.edit = false;
        event.stopPropagation();
      }
    };

    $scope.deleteEntry = function () {
      $scope.open('sm');
    };

    $scope.open = function (size) {
      $scope.modalInstance = $modal.open({
        scope: $scope,
        animation: true,
        templateUrl: '../views/deleteEntryConfirmation.html',
        size: size
      });
    };

    $scope.deleteItem = function (event) {
      if (calculatorSaveDataService.isExpense($scope.name)) {
        yearlyOverviewService.deleteExpenses($scope.id);
        $scope.cancelEdition(event);
      }
      else {
        yearlyOverviewService.deleteIncomes($scope.id);
        $scope.cancelEdition(event);
      }
      $scope.removeThisElement();
      $scope.modalInstance.close();
    };

    $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
    };

    $scope.saveEdition = function (event) {
      if (calculatorSaveDataService.isExpense($scope.name)) {
        var expenseToUpdate = {
          'ExpenseId': $scope.id,
          'Name': $scope.selectedCategory.name,
          'Value': $scope.newValue,
          'ExpectedExpense': {ExpectedExpenseId: calculatorSaveDataService.getExpectedExpenseId($scope.selectedCategory.name)},
          'Date': $scope.selection.date
        };
        yearlyOverviewService.updateExpenses($scope.id, expenseToUpdate);
      }
      else {
        var incomeToUpdate = {
          'IncomeId': $scope.id,
          'Name': $scope.selectedCategory.name,
          'Value': $scope.newValue,
          'ExpectedIncome': {ExpectedIncomeId: calculatorSaveDataService.getExpectedIncomeId($scope.selectedCategory.name)},
          'Date': $scope.selection.date
        };
        yearlyOverviewService.updateIncomes($scope.id, incomeToUpdate);
      }
      $scope.cancelEdition(event);
      $scope.date = $scope.selection.date;
      $scope.name = $scope.selectedCategory.name;
      $scope.value = $scope.newValue;
    };

    function generateCategories() {
      if (calculatorSaveDataService.isExpense($scope.name)) {
        $scope.categories = calculatorSaveDataService.getExpectedExpenses();
      }
      else {
        $scope.categories = calculatorSaveDataService.getExpectedIncome();
      }
    }

    function disableMyself() {
      if (!$scope.edit) {
        $scope.disabled = true;
      }
    }

    function enableMyself() {
      if ($scope.disabled) {
        $scope.disabled = false;
      }
    }

    $scope.$on('CREATE_EDITABLE_FIELDS_CLICKED', disableMyself);
    $scope.$on('CANCEL_EDITABLE_FIELDS', enableMyself);
    $scope.$watchCollection('expectedExpenses', function () {
      generateCategories();
    });
    $scope.$watchCollection('expectedIncomes', function () {
      generateCategories();
    });

    generateCategories();
  }]);
