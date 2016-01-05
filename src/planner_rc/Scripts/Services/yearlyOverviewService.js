/**
 * Created by Yolanda G E on 8/30/2015.
 */
'use strict';

angular.module('yoprojectAngularApp')
  .service('yearlyOverviewService',['$http', '$q', 'server', function ($http, $q, server) {
    var self = this;
    var expenses = [];
    var incomes = [];

    self.getWeek = function (dateToCalculate) {
      var dayMilis = 86400000;
      var firstJanuary = new Date(dateToCalculate.getFullYear(), 0, 1);
      return Math.ceil((((dateToCalculate - firstJanuary) / dayMilis) + firstJanuary.getDay() + 1) / 7);
    };

    self.getYearlyBalance = function () {
      var deferredIncomes = $q.defer();
      var promiseIncomes = deferredIncomes.promise;
      var deferredExpenses = $q.defer();
      var promiseExpenses = deferredExpenses.promise;

      getIncomes(deferredIncomes);
      getExpenses(deferredExpenses);
      var deferred = $q.defer();

      $q.all([promiseIncomes, promiseExpenses]).then(function (results) {
          var yearlyOverview = {incomes: results[0], expenses: results[1]};
          deferred.resolve(yearlyOverview);
        }
      );
      return deferred.promise;
    };

    self.deleteExpenses = function (expenseId) {
      $http.delete('api/Expenses/' + expenseId).success(function (expenseData) {
      }).error(function (error) {
        console.log('Error deleting expenses');
      });
    };

    self.deleteIncomes = function (incomeId) {
      $http.delete('api/Incomes/' + incomeId).success(function (incomeData) {
      }).error(function (error) {
        console.log('Error deleting incomes');
      });
    };

    self.updateExpenses = function (id, expenseToUpdate) {
      $http.put('api/Expenses/' + id, expenseToUpdate).success(function (expenseData) {
      }).error(function (error) {
        console.log('Error updating expenses');
      });
    };

    self.updateIncomes = function (id, incomeToUpdate) {
      $http.put('api/Incomes/' + id, incomeToUpdate).success(function (incomeData) {
      }).error(function (error) {
        console.log('Error updating incomes');
      });
    };

    function getExpenses(deferredExpenses) {
      expenses = [];
      $http.get('api/Expenses').success(function (expensesData) {
        expensesData.forEach(function (expenseItem) {
          var item = {
            name: expenseItem.ExpectedExpense.Name,
            value: expenseItem.Value,
            month: new Date(Date.parse(expenseItem.Date)).getUTCMonth() + 1,
            day: new Date(Date.parse(expenseItem.Date)).getUTCDate(),
            year: new Date(Date.parse(expenseItem.Date)).getFullYear(),
            date: new Date(Date.parse(expenseItem.Date)),
            week: self.getWeek(new Date(Date.parse(expenseItem.Date))),
            type: 'expense',
            id: expenseItem.ExpenseId,
            deleted: expenseItem.ExpectedExpense.Deleted
          };
          expenses.push(item);
        });
        deferredExpenses.resolve(expenses);
      }).error(function (error) {
        deferredExpenses.reject(error);
      });
    }

    function getIncomes(deferredIncomes) {
      incomes = [];
      $http.get('api/Incomes').success(function (incomesData) {
        incomesData.forEach(function (incomeItem) {
          var item = {
            name: incomeItem.ExpectedIncome.Name,
            value: incomeItem.Value,
            month: new Date(Date.parse(incomeItem.Date)).getUTCMonth() + 1,
            day: new Date(Date.parse(incomeItem.Date)).getUTCDate(),
            year: new Date(Date.parse(incomeItem.Date)).getFullYear(),
            date: new Date(Date.parse(incomeItem.Date)),
            week: self.getWeek(new Date(Date.parse(incomeItem.Date))),
            type: 'income',
            id: incomeItem.IncomeId,
            deleted: incomeItem.ExpectedIncome.Deleted
          };
          incomes.push(item);
        });
        deferredIncomes.resolve(incomes);
      }).error(function (error) {
        deferredIncomes.reject(error);
      });
    }
  }]);

