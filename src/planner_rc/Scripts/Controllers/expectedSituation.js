/**
 * Created by Yolanda G E on 25/06/2015.
 */
'use strict';

/**
 * @ngdoc function
 * @name yoprojectAngularApp.controller:CalculatorCtrl
 * @description
 * # ExpectedSituationCtrl
 * Controller of the yoprojectAngularApp
 */
angular.module('yoprojectAngularApp').controller('ExpectedSituationCtrl', ['$scope', '$location', '$http', '$rootScope', 'server', 'calculatorSaveDataService', 'loginService', function ($scope, $location, $http, $rootScope, server, calculatorSaveDataService, loginService) {
    $scope.incomeFields = calculatorSaveDataService.getExpectedIncome();
    $scope.expensesFields = calculatorSaveDataService.getExpectedExpenses();
    $scope.fields = $scope.incomeFields.concat($scope.expensesFields);
    $scope.disabled = false;
    $scope.loginStatus = loginService.loginStatus;
    var expectedBenefits = 0;
    var expectedExpenses = 0;
    var chart;

    $scope.showTotalMonthlyBenefits = function () {
        return $scope.incomeFields.length > 0;
    };

    $scope.showTotalMonthlyExpenses = function () {
        return $scope.expensesFields.length > 0;
    };

    $scope.calculateExpectedExpenses = function () {
        expectedExpenses = calculateExpectedExpenses();
        refreshChart();
        return expectedExpenses;
    };

    $scope.calculateExpectedBenefits = function () {
        var expectedTotalIncome = 0;
        $scope.incomeFields.forEach(function (incomeField) {
            expectedTotalIncome += incomeField.value;
        });
        expectedBenefits = expectedTotalIncome - calculateExpectedExpenses();
        refreshChart();
        return expectedBenefits;
    };

    $scope.addIncomeField = function () {
        $scope.disabled = true;
        $scope.showNewIncomeItem = true;
        $scope.incomeFields.push({
            name: "INCOME" + ($scope.incomeFields.length + 1),
            value: "",
            type: "income",
            id: 0,
            deleted: false
        });
        $rootScope.$broadcast('CREATE_EDITABLE_FIELDS_CLICKED');
    };

    $scope.addExpensesField = function () {
        $scope.disabled = true;
        $scope.showNewExpensesItem = true;
        $scope.expensesFields.push({
            name: "EXPENSE" + ($scope.expensesFields.length + 1),
            value: "",
            type: "expense",
            id: 0,
            deleted: false
        });
        $rootScope.$broadcast('CREATE_EDITABLE_FIELDS_CLICKED');
    };

    $scope.removeIncomeItem = function (incomeToRemove) {
        if (incomeToRemove.id != null) {
            incomeToRemove.deleted = true;
        }
    };

    $scope.removeExpensesItem = function (expenseToRemove) {
        if (expenseToRemove.id != null) {
            expenseToRemove.deleted = true;
        }
    };

    $scope.filterDeleted = function (item) {
        return item.deleted === false;
    };


    function calculateRowsPerPage() {
        var topTitle = 50;
        var titleHeight = 52;
        var paginationHeight = 74;
        var addButtonsHeight = 100;
        var rowHeight = 45;
        var totalExpectationsRowsHeight = 2 * rowHeight;
        var totalHeight = window.innerHeight - titleHeight - paginationHeight - topTitle - totalExpectationsRowsHeight - addButtonsHeight;

        return Math.max(5, (Math.ceil(totalHeight / rowHeight) - 1));
    }

    function generatePagination() {
        $scope.numPerPage = calculateRowsPerPage();
        $scope.paginatedFields = [];
        $scope.currentPage = 1;
        $scope.totalLength = $scope.fields.length;
        $scope.maxSize = Math.ceil($scope.fields.length / $scope.numPerPage);

        if (_.any($scope.fields, { id: 0 })) {
            var element = (_.find($scope.fields, { id: 0 }));
            var index = $scope.fields.indexOf(element) + 1;
            $scope.currentPage = Math.ceil(index / $scope.numPerPage);
        }

        $scope.$watch('currentPage + numPerPage', function () {
            $scope.begin = (($scope.currentPage - 1) * $scope.numPerPage)
              , $scope.end = $scope.begin + $scope.numPerPage;

            $scope.paginatedFields = $scope.fields.slice($scope.begin, $scope.end);
        });
    }

    function addChart() {
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
              .duration(500);

            updateChartData();

            nv.utils.windowResize(function () {
                refreshChart();
            });

            return chart;
        });
    }

    function updateChartData() {
        var chartData = [
           { key: 'incomes', values: $scope.incomeFields },
           { key: 'expenses', values: $scope.expensesFields }
        ];

        d3.select('#chart svg')
          .datum(chartData)
          .call(chart);
    }

    function refreshChart() {
        if (_.isUndefined(chart)) {
            return;
        }

        updateChartData();

        d3.select('.nv-x.nv-axis').selectAll('text')
          .style("text-anchor", "end")
          .attr('transform', function () {
              return 'translate (-10, 0) rotate(-45)';
          });
    }

    function calculateExpectedExpenses() {
        var expectedTotalExpenses = 0;
        $scope.expensesFields.forEach(function (expensesField) {
            expectedTotalExpenses += expensesField.value;
        });
        return expectedTotalExpenses;
    }

    function removeNewField() {
        if (_.any($scope.expensesFields, { id: 0 })) {
            $scope.expensesFields.splice($scope.expensesFields.length - 1, 1);
        }
        else {
            $scope.incomeFields.splice($scope.incomeFields.length - 1, 1);
        }
        $scope.disabled = false;
    }

    function disableButtons() {
        $scope.disabled = true;
    }

    function enableButtons() {
        $scope.disabled = false;
    }

    generatePagination();
    $scope.$watchCollection('incomeFields', function (newExpectedIncomes) {
        $scope.fields = newExpectedIncomes.concat($scope.expensesFields);
        generatePagination();
    });

    $scope.$watchCollection('expensesFields', function (newExpectedExpenses) {
        $scope.fields = $scope.incomeFields.concat(newExpectedExpenses);
        generatePagination();
    });

    $scope.$watch('currentPage', function (currentPage) {
        if (currentPage > $scope.maxSize) {
            $scope.currentPage--;
        }
    });

    $scope.$on('CANCEL_CREATE_EDITABLE_FIELD', removeNewField);
    $scope.$on('CREATE_EDITABLE_FIELDS_CLICKED', disableButtons);
    $scope.$on('CANCEL_EDITABLE_FIELDS', enableButtons);
    var chart = addChart();
    var container = d3.select('#chart svg');
    var wrap = container.selectAll('g.nv-wrap.nv-axis');
    var g = wrap.select('g').selectAll('g');
    g.attr('transform', function (d, i, j) { return 'translate (-15, 60) rotate(-90 0,0)' });

}]);
