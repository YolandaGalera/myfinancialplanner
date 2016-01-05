/**
 * Created by Yolanda G E on 28/06/2015.
 */
'use strict';

angular.module('yoprojectAngularApp')
  .service('calculatorSaveDailyRealSituationService', ['$http', '$q', 'server', function ($http, $q, server) {
    var dailyBalance = [];
    var self = this;

    self.saveData = function (dailyFieldsToStore, date) {
      dailyFieldsToStore.forEach(function (dailyItem) {
        if (dailyItem.value != null && dailyItem.value != 0) {
          if (dailyItem.type == 'income') {
            saveDailyIncome(dailyItem, date);
          } else {
            saveDailyExpense(dailyItem, date);
          }
        }
      });
    };

    function saveDailyIncome(dailyItem, date) {
      var dailyIncome = {
        'Name': dailyItem.name,
        'Value': dailyItem.value,
        'ExpectedIncome': {ExpectedIncomeId: dailyItem.id},
        'Date': date
      };
        $http.post(server + 'api/Incomes', dailyIncome).success(function (incomeData) {
      }).error(function (error) {
        console.log('Error saving daily incomes');
      });
    }

    function saveDailyExpense(dailyItem, date) {
      var dailyExpense = {
        'Name': dailyItem.name,
        'Value': dailyItem.value,
        'ExpectedExpense': {ExpectedExpenseId: dailyItem.id},
        'Date': date
      };
        $http.post(server + 'api/Expenses', dailyExpense).success(function (expenseData) {
      }).error(function (error) {
        console.log('Error saving daily expenses');
      });
    }
  }]);
