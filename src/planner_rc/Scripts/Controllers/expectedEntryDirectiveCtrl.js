/**
 * Created by Yolanda G E on 9/13/2015.
 */
'use strict';

angular.module('yoprojectAngularApp')
  .controller('ExpectedEntryDirectiveCtrl', ['$rootScope', '$scope', '$modal', 'calculatorSaveDataService', function ($rootScope, $scope, $modal, calculatorSaveDataService) {
    $scope.disabled = false;
    $scope.edit = false;
    $scope.newValue = {quantity: $scope.value, name: $scope.name};
    $scope.showDuplicatedNamesError = false;
    $scope.expectedExpenses = calculatorSaveDataService.getExpectedExpenses();
    $scope.expectedIncomes = calculatorSaveDataService.getExpectedIncome();
    $scope.modalInstance = undefined;

    $scope.isNewEntry = function () {
      return $scope.id === 0;
    };

    $scope.createEditableFields = function () {
      if (!$scope.disabled && $scope.id != 0) {
        $scope.edit = true;
        $rootScope.$broadcast('CREATE_EDITABLE_FIELDS_CLICKED');
      }
    };

    $scope.cancelEdition = function (event) {
      if ($scope.id === 0) {
        $rootScope.$broadcast('CANCEL_CREATE_EDITABLE_FIELD');
      }

      $rootScope.$broadcast('CANCEL_EDITABLE_FIELDS');
      $scope.showDuplicatedNamesError = false;
      $scope.newValue = {quantity: $scope.value, name: $scope.name};
      $scope.edit = false;
      generateCategories();
      event.stopPropagation();
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
        var expectedEntryToDelete = {
          'expectedExpenseId': $scope.id,
          'name': $scope.name,
          'value': $scope.newValue.quantity,
          'deleted': true
        };
        calculatorSaveDataService.deleteExpectedExpenses(expectedEntryToDelete);
      }
      else {
        var expectedEntryToDelete = {
          'expectedIncomeId': $scope.id,
          'name': $scope.name,
          'value': $scope.newValue.quantity,
          'deleted': true
        };
        calculatorSaveDataService.deleteExpectedIncomes(expectedEntryToDelete);
      }
      $scope.cancelEdition(event);
      $scope.modalInstance.close();
    };

    $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
    };

    $scope.saveEdition = function (isValid, event) {
        console.log("saveEdition");
        if (!isValid) {
            console.log("saveEdition IS NOT VALID");
        return;
      }
      if (hasDuplicates(calculatorSaveDataService.getExpectedIncome().concat(calculatorSaveDataService.getExpectedExpenses()), $scope.id, $scope.newValue.name)) {
          $scope.showDuplicatedNamesError = true;
          console.log("saveEdition DUPLICATES");
        return;
      }
      $scope.showDuplicatedNamesError = false;

      if ($scope.id != 0) {
          console.log("saveEdition SCOPE ID NOT 0");
        updateEntry();
      }
      else {
          console.log("saveEdition SCOPE ID 0");
        saveEntry();
      }
      restoreState();
      event.stopPropagation();
    };

    function updateExpectedExpenses() {
      var expectedItemToUpdate = {
        'expectedExpenseId': $scope.id,
        'name': $scope.newValue.name,
        'value': $scope.newValue.quantity,
        'deleted': false
      };
      calculatorSaveDataService.updateExpectedExpenses($scope.id, expectedItemToUpdate);
    }

    function updateExpectedIncomes() {
      var expectedItemToUpdate = {
        'expectedIncomeId': $scope.id,
        'name': $scope.newValue.name,
        'value': $scope.newValue.quantity,
        'deleted': false
      };
      calculatorSaveDataService.updateExpectedIncomes($scope.id, expectedItemToUpdate);
    }

    function updateEntry() {
      if ($scope.type === 'expense') {
        updateExpectedExpenses();
      }
      else {
        updateExpectedIncomes();
      }
    }

    function saveEntry() {
      var expectedItemToSave = {
        'name': $scope.newValue.name,
        'value': $scope.newValue.quantity,
        'deleted': false
      };
      if ($scope.type === 'income') {
        calculatorSaveDataService.saveExpectedIncome(expectedItemToSave);
      }
      else {
        calculatorSaveDataService.saveExpectedExpense(expectedItemToSave);
      }
    }

    function restoreState() {
        console.log("saveEdition RESTORE");
      $scope.name = $scope.newValue.name;
      $scope.value = $scope.newValue.quantity;
      $scope.edit = false;
      $rootScope.$broadcast('CANCEL_EDITABLE_FIELDS');
      generateCategories();
    }

    function hasDuplicates(balanceFields, idToCompare, nameToCompare) {
      var balanceFieldsShown = _.filter(balanceFields, 'deleted', false);
      return (_.any(balanceFieldsShown, 'name', nameToCompare) && _.find(balanceFieldsShown, 'name', nameToCompare).id != idToCompare);
    }

    function generateCategories() {
      if (calculatorSaveDataService.isExpense($scope.newValue.name)) {
        $scope.categories = calculatorSaveDataService.getExpectedExpenses();
        return;
      }
      $scope.categories = calculatorSaveDataService.getExpectedIncome();
    }

    function disableMyself() {
      if (!$scope.edit || $scope.isNewEntry()) {
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
