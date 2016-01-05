/**
 * Created by Yolanda G E on 9/2/2015.
 */
'use strict';

angular.module('yoprojectAngularApp')
  .controller('BalanceDetailCtrl', ['$scope', '$filter', 'calculatorSaveDataService', 'yearlyOverviewService', function ($scope, $filter, calculatorSaveDataService, yearlyOverviewService) {
    var result = {};
    var groupByResult = {};
    var filters = [];
    $scope.predicate = 'date';
    $scope.reverse = true;
    $scope.expectedExpenses = calculatorSaveDataService.getExpectedExpenses();
    $scope.expectedIncome = calculatorSaveDataService.getExpectedIncome();
    $scope.typeCategories = $scope.expectedExpenses.concat($scope.expectedIncome);
    $scope.selectedTypeCategory = {name: ""};
    $scope.incomeFilter = false;
    $scope.expenseFilter = false;
    $scope.fromValue = null;
    $scope.toValue = null;
    $scope.dateFilter = {fromDate: null, toDate: null};
    $scope.periods = [{name: 'daily'}, {name: 'weekly'}, {name: 'monthly'}, {name: 'yearly'}];
    $scope.selectedPeriod = {name: ""};
    $scope.isShowFilter = true;
    $scope.isShowGroupBy = false;

    yearlyOverviewService.getYearlyBalance()
      .then(generateOrderedBalanceEntries);

    $scope.groupByManager = function () {
      if (!$scope.nameGroup && !$scope.typeGroup) {
        $scope.selectedPeriod = {name: ""};
        $scope.filterManager();
        return;
      }

      if ($scope.nameGroup) {
        if ($scope.selectedPeriod.name == '') {
          $scope.selectedPeriod = $scope.periods[2]
        }
        $scope.balance = convertToArray(result);
        groupByNameBalanceEntries($scope.balance);
      }

      if ($scope.typeGroup) {
        if ($scope.selectedPeriod.name == '') {
          $scope.selectedPeriod = $scope.periods[2]
        }
        $scope.balance = convertToArray(result);
        groupByTypeBalanceEntries($scope.balance);
      }
    };

    $scope.toggleOrder = function (predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
      order();
    };

    $scope.filterManager = function () {
      $scope.balance = convertToArray(result);
      filterName();
      filterType();
      filterValue();
      filterDate();
      order();
    };


    $scope.toggleFilter = function () {
      $scope.isShowFilter = !$scope.isShowFilter;
      $scope.isShowGroupBy = false;
      resetGroupByForm();
      $scope.groupByManager();
    };

    $scope.toggleGroupBy = function () {
      $scope.isShowGroupBy = !$scope.isShowGroupBy;
      $scope.isShowFilter = false;
      resetFilterForm();
      $scope.groupByManager();
    };

    function resetGroupByForm() {
      $scope.nameGroup = '';
      $scope.typeGroup = '';
      $scope.selectedPeriod =  '';
    }

    function resetFilterForm() {
      if($scope.left){
        $scope.left.fromDate = '';
        $scope.left.toDate = '';
      }
      $scope.incomeFilter =  '';
      $scope.expenseFilter =  '';
      $scope.selectedTypeCategory =  '';
      $scope.fromValue =  '';
    }

    function filterName() {
      if ($scope.selectedTypeCategory != null) {
        $scope.balance = $filter('filter')($scope.balance, $scope.selectedTypeCategory.name);
      }
    };

    function filterType() {
      var balanceIncome = [];
      var balanceExpense = [];

      if ($scope.incomeFilter) {
        balanceIncome = $filter('filter')($scope.balance, 'income');
      }

      if ($scope.expenseFilter) {
        balanceExpense = $filter('filter')($scope.balance, 'expense');
      }

      if ($scope.incomeFilter || $scope.expenseFilter) {
        $scope.balance = balanceIncome.concat(balanceExpense);
      }
    };

    function filterValue() {
      if ($scope.fromValue != null || $scope.toValue != null) {
        var minValue = $scope.fromValue != null ? $scope.fromValue : Number.MIN_VALUE;
        var maxValue = $scope.toValue != null ? $scope.toValue : Number.MAX_VALUE;

        $scope.balance = $scope.balance.filter(function (item) {
          return (item.value >= minValue && item.value <= maxValue);
        });
      }
    };

    function filterDate() {
      if ($scope.dateFilter.fromDate != null || $scope.dateFilter.toDate != null) {
        $scope.balance = $scope.balance.filter(
          function (item) {
            if ($scope.dateFilter.fromDate === null && $scope.dateFilter.toDate != null) {
              return (item.date.setHours(0, 0, 0, 0) <= $scope.dateFilter.toDate.setHours(0, 0, 0, 0));
            }

            if ($scope.dateFilter.fromDate != null && $scope.dateFilter.toDate === null) {
              return (item.date.setHours(0, 0, 0, 0) >= $scope.dateFilter.fromDate.setHours(0, 0, 0, 0));
            }

            if ($scope.dateFilter.fromDate != null && $scope.dateFilter.toDate != null) {
              return (item.date.setHours(0, 0, 0, 0) >= $scope.dateFilter.fromDate.setHours(0, 0, 0, 0) && item.date.setHours(0, 0, 0, 0) <= $scope.dateFilter.toDate.setHours(0, 0, 0, 0));
            }
          }
        );
      }
    };

    function order() {
      $scope.balance = $filter('orderBy')($scope.balance, $scope.predicate, $scope.reverse);
      $scope.filteredBalance = $scope.balance.slice($scope.begin, $scope.end);
      $scope.currentPage = 1;
    };

    function calculateRowsPerPage() {
      var titleHeight = 52;
      var headerHeight = 59;
      var paginationHeight = 64;
      var topTitle = 50;
      var totalHeight = window.innerHeight - titleHeight - headerHeight - paginationHeight - topTitle;
      var rowHeight = 50;
      return Math.max(5, (Math.ceil(totalHeight / rowHeight) - 1));
    }

    function generatePagination() {
      $scope.numPerPage = calculateRowsPerPage();
      $scope.filteredBalance = [];
      $scope.currentPage = 1;
      $scope.maxSize = Math.ceil($scope.balance.length / $scope.numPerPage);


      $scope.$watch('currentPage + numPerPage', function () {
        $scope.begin = (($scope.currentPage - 1) * $scope.numPerPage)
          , $scope.end = $scope.begin + $scope.numPerPage;

        $scope.filteredBalance = $scope.balance.slice($scope.begin, $scope.end);
      });
    }

    function convertToArray(result) {
      return _.cloneDeep(_.flatten(Object.keys(result).map(function (k) {
            return result[k]
          })
        )
      );
    }

    function orderBalanceEntries() {
      $scope.balance = convertToArray(result);
      order();
    }

    function createBalanceEntry(result, balanceEntry, incomeNames) {
      if (!result.income && !result.expenses) {
        result.income = [];
        result.expenses = [];
      }

      if (_.includes(incomeNames, balanceEntry.name)) {
        result.income.push(balanceEntry);
        return;
      }
      result.expenses.push(balanceEntry);
    }

    function generateOrderedBalanceEntries(balanceEntries) {
      var incomeNames = _.pluck(balanceEntries.incomes, "name");

      balanceEntries.incomes.forEach(function (incomeEntry) {
        createBalanceEntry(result, incomeEntry, incomeNames);
      });

      balanceEntries.expenses.forEach(function (expenseEntry) {
        createBalanceEntry(result, expenseEntry, incomeNames);
      });

      orderBalanceEntries();
      generatePagination();
    }

    function groupByNameDailyBalanceEntries(balanceEntries) {
      return _.reduce(balanceEntries, function (acc, balanceEntry) {
        var element = _.find(acc, {name: balanceEntry.name, date: balanceEntry.date.setHours(0, 0, 0, 0)});
        if (_.isUndefined(element)) {
          balanceEntry.date = balanceEntry.date.setHours(0, 0, 0, 0);
          acc.push(balanceEntry);
          return acc;
        }
        element.value += balanceEntry.value;
        return acc;
      }, []);
    }

    function groupByNamePeriodicityBalanceEntries(balanceEntries, periodicity) {
      return _.reduce(balanceEntries, function (acc, balanceEntry) {
        var elementToFind = {name: balanceEntry.name};
        elementToFind[periodicity] = balanceEntry[periodicity];
        var element = _.find(acc, elementToFind);
        if (_.isUndefined(element)) {
          acc.push(balanceEntry);
          return acc;
        }
        element.value += balanceEntry.value;
        return acc;
      }, []);
    }

    function groupByNameBalanceEntries(balanceEntries) {
      switch ($scope.selectedPeriod.name) {
        case 'daily':
          $scope.balance = groupByNameDailyBalanceEntries(balanceEntries);
          break;
        case 'weekly':
          $scope.balance = groupByNamePeriodicityBalanceEntries(balanceEntries, 'week');
          break;
        case 'yearly':
          $scope.balance = groupByNamePeriodicityBalanceEntries(balanceEntries, 'year');
          break;
        default:
          $scope.balance = groupByNamePeriodicityBalanceEntries(balanceEntries, 'month');
      }
      order();
    }

    function groupByTypeBalanceEntries(balanceEntries) {
      switch ($scope.selectedPeriod.name) {
        case 'daily':
          $scope.balance = groupByTypeDailyBalanceEntries(balanceEntries);
          break;
        case 'weekly':
          $scope.balance = groupByTypePeriodicityBalanceEntries(balanceEntries, 'week');
          break;
        case 'yearly':
          $scope.balance = groupByTypePeriodicityBalanceEntries(balanceEntries, 'year');
          break;
        default:
          $scope.balance = groupByTypePeriodicityBalanceEntries(balanceEntries, 'month');
      }
      order();
    }

    function groupByTypePeriodicityBalanceEntries(balanceEntries, periodicity) {
      return _.reduce(balanceEntries, function (acc, balanceEntry) {
        var elementToFind = {type: balanceEntry.type};
        elementToFind[periodicity] = balanceEntry[periodicity];
        var element = _.find(acc, elementToFind);
        if (_.isUndefined(element) && balanceEntry.type == 'income') {
          balanceEntry.name = 'Income';
          acc.push(balanceEntry);
          return acc;
        }
        if (_.isUndefined(element) && balanceEntry.type == 'expense') {
          balanceEntry.name = 'Expense';
          acc.push(balanceEntry);
          return acc;
        }
        element.value += balanceEntry.value;
        return acc;
      }, []);
    }

    function groupByTypeDailyBalanceEntries(balanceEntries) {
      return _.reduce(balanceEntries, function (acc, balanceEntry) {
        var element = _.find(acc, {type: balanceEntry.type, date: balanceEntry.date.setHours(0, 0, 0, 0)});
        if (_.isUndefined(element) && balanceEntry.type == 'income') {
          balanceEntry.date = balanceEntry.date.setHours(0, 0, 0, 0);
          balanceEntry.name = 'Income';
          acc.push(balanceEntry);
          return acc;
        }
        if (_.isUndefined(element) && balanceEntry.type == 'expense') {
          balanceEntry.date = balanceEntry.date.setHours(0, 0, 0, 0);
          balanceEntry.name = 'Expense';
          acc.push(balanceEntry);
          return acc;
        }
        element.value += balanceEntry.value;
        return acc;
      }, []);
    }

    $scope.$watchCollection('expectedIncome', function (newExpectedIncomes) {
      $scope.typeCategories = newExpectedIncomes.concat($scope.expectedExpenses);
    });

    $scope.$watchCollection('expectedExpenses', function (newExpectedExpenses) {
      $scope.typeCategories = newExpectedExpenses.concat($scope.expectedIncome);
    });

    $scope.$watch('currentPage', function (currentPage) {
      if (currentPage > $scope.maxSize) {
        $scope.currentPage--;
      }
    });

    $scope.$watch('nameGroup', function (nameGroup) {
      if (nameGroup == true) {
        $scope.typeGroup = false;
      }
    });

    $scope.$watch('typeGroup', function (typeGroup) {
      if (typeGroup == true) {
        $scope.nameGroup = false;
      }
    });
  }]);
