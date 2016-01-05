/**
 * Created by Yolanda G E on 28/06/2015.
 */
'use strict';

/**
 * @ngdoc function
 * @name yoprojectAngularApp.controller:YearlyOverviewCtrl
 * @description
 * # YearlyOverviewCtrl
 * Controller of the yoprojectAngularApp
 */
angular.module('yoprojectAngularApp')
  .controller('YearlyOverviewCtrl', ['$scope', '$location', '$q', 'calculatorSaveDataService', 'yearlyOverviewService', function ($scope, $location, $q, calculatorSaveDataService, yearlyOverviewService) {
    $scope.incomeExpected = calculatorSaveDataService.getExpectedIncome();
    $scope.expensesExpected = calculatorSaveDataService.getExpectedExpenses();
    $scope.benefitsExpected = calculatorSaveDataService.getTotalBenefitsExpected();
    $scope.totalExpensesExpected = calculatorSaveDataService.getTotalExpensesExpected();
    $scope.currentYear = new Date().getFullYear();
    var charts = [];
    var result = {};

    $scope.getExpectedIncome = function (name) {
      var value;
      $scope.incomeExpected.forEach(function (incomeItem) {
        if (incomeItem.name == name) {
          value = incomeItem.value;
        }
      })
      return value;
    };

    $scope.getExpectedExpense = function (name) {
      var value;
      $scope.expensesExpected.forEach(function (expenseItem) {
        if (expenseItem.name == name) {
          value = expenseItem.value;
        }
      })
      return value;
    };

    $scope.getExpectedMessage = function (realValue, expectedValue) {
      if (typeof realValue === 'undefined' || typeof expectedValue === 'undefined' || isNaN(realValue)) {
        return;
      }
      if (realValue <= expectedValue) {
        return 'Good';
      }
      return 'Failed expectatives :(';
    };

    $scope.getExpectedMessageIncomeBenefits = function (realValue, expectedValue) {
      if (typeof realValue === 'undefined' || typeof expectedValue === 'undefined' || isNaN(realValue)) {
        return;
      }
      if (realValue >= expectedValue) {
        return 'Good';
      }
      return 'Failed expectatives :(';
    };

    $scope.getMonthName = function (month) {
      var year = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return year[month-1];
    };

    function createMonthEntry(result, balanceEntry, incomeNames, expensesNames) {
      if (!result[balanceEntry.month]) {
        result[balanceEntry.month] = {};
        result[balanceEntry.month].month = balanceEntry.month;
        result[balanceEntry.month].income = [];
        result[balanceEntry.month].expenses = [];
        result[balanceEntry.month].totalExpenses = 0;
        result[balanceEntry.month].benefits = 0;
        result[balanceEntry.month].totalIncomes = 0;
      }

      if (_.includes(incomeNames, balanceEntry.name)) {
        result[balanceEntry.month].income.push({
          name: balanceEntry.name,
          value: balanceEntry.value
        });
        result[balanceEntry.month].totalIncomes += balanceEntry.value;
      }
      else {
        result[balanceEntry.month].expenses.push({
          name: balanceEntry.name,
          value: balanceEntry.value
        });
        result[balanceEntry.month].totalExpenses += balanceEntry.value;
      }

      result[balanceEntry.month].benefits = result[balanceEntry.month].totalIncomes - result[balanceEntry.month].totalExpenses;
      return result[balanceEntry.month].totalIncomes;
    }

    function computeMonthEntry(incomeNames, result, balanceEntry, expensesNames) {
      if (_.includes(incomeNames, balanceEntry.name)) {
        _.find(result[balanceEntry.month].income, {name: balanceEntry.name}).value += balanceEntry.value;
        result[balanceEntry.month].totalIncomes += _.filter(result[balanceEntry.month].income, {name: balanceEntry.name})[0].value;
      }
      else {
        _.filter(result[balanceEntry.month].expenses, {name: balanceEntry.name})[0].value += balanceEntry.value;
        result[balanceEntry.month].totalExpenses += balanceEntry.value;
      }
      result[balanceEntry.month].benefits = result[balanceEntry.month].totalIncomes - result[balanceEntry.month].totalExpenses;
    }

    function createMonthlyOverview() {
      var deferred = $q.defer();
      var promise = deferred.promise;
      yearlyOverviewService.getYearlyBalance()
        .then(function (balanceEntries) {
          var incomeNames = _.pluck(balanceEntries.incomes, "name");
          var expensesNames = _.pluck(balanceEntries.expenses, "name");

          balanceEntries.incomes.forEach(function (incomeEntry) {
            if (!result[incomeEntry.month] || _.find(result[incomeEntry.month].income, {name: incomeEntry.name}) === undefined) {
              createMonthEntry(result, incomeEntry, incomeNames, expensesNames);
            }
            else {
              computeMonthEntry(incomeNames, result, incomeEntry, expensesNames);
            }
          });

          balanceEntries.expenses.forEach(function (expenseEntry) {
            if (!result[expenseEntry.month] || _.find(result[expenseEntry.month].expenses, {name: expenseEntry.name}) === undefined) {
              createMonthEntry(result, expenseEntry, incomeNames, expensesNames);
            }
            else {
              computeMonthEntry(incomeNames, result, expenseEntry, expensesNames);
            }
          });

          $scope.overviews = Object.keys(result).map(function (k) {
            return result[k]
          });
          deferred.resolve();
        });
      return promise;
    }

    function addChart() {
      if (_.isUndefined($scope.overviews)) {
        return;
      }
      $scope.overviews.forEach(function (overview) {
        var chart;
        nv.addGraph(function () {
          chart = nv.models.discreteBarChart()
            .x(function (d) {
              return d.name;
            })
            .y(function (d) {
              return d.value;
            })
            .staggerLabels(true)
            .showValues(true)
            .duration(500)
          ;
          var chartData = [{key: 'incomes', values: overview.income}, {
            key: 'expenses',
            values: overview.expenses
          }];

          d3.select('#chart' + overview.month + ' svg')
            .datum(chartData)
            .call(chart);

          d3.select('.nv-x.nv-axis').selectAll('text')
            .style("text-anchor", "end")
            .attr('transform', function () {
              return 'translate(-10, 0) rotate(-45)'
            });

         // d3.selectAll(".discreteBar")
         //.style("fill", function (d, i) {
         //    console.log('d', d);
         //    return d.type === 'expense' ? "#d62728" : "#2ca02c";
         //});

          nv.utils.windowResize(function() {
            d3.select('.nv-x.nv-axis').selectAll('text')
              .style("text-anchor", "end")
              .attr('transform', function () {
                return 'translate(-10, 0) rotate(-45)'
              });
          });

          return chart;
        });
        charts.push(chart);
      })
    }

    init();
    function init() {
      createMonthlyOverview()
        .then(function () {
          addChart();
        });
    }
  }]);
