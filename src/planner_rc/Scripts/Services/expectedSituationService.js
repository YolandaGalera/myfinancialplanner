/**
 * Created by Yolanda G E on 25/06/2015.
 */
'use strict';

angular.module('yoprojectAngularApp')
  .service('calculatorSaveDataService', ['$http', '$q', 'server', function ($http, $q, server) {
      var incomes = [];
      var expenses = [];
      var item;
      var self = this;

      self.loadExpectedSituation = function () {
          var deferredIncomes = $q.defer();
          var deferredExpenses = $q.defer();
          $http.get(server + 'api/ExpectedIncomes').success(function (expectedIncomeData) {
              expectedIncomeData.forEach(function (expectedIncomeItem) {
                  item = {
                      name: expectedIncomeItem.Name,
                      value: expectedIncomeItem.Value,
                      id: expectedIncomeItem.ExpectedIncomeId,
                      type: "income",
                      deleted: expectedIncomeItem.Deleted
                  };
                  incomes.push(item);
                  deferredIncomes.resolve(item);
              });
          }).error(function (error) {
              deferredIncomes.reject();
              console.log('Error getting expected incomes');
          });

          $http.get(server + 'api/ExpectedExpenses').success(function (expectedExpenseData) {
              expectedExpenseData.forEach(function (expectedExpenseItem) {
                  item = {
                      name: expectedExpenseItem.Name,
                      value: expectedExpenseItem.Value,
                      id: expectedExpenseItem.ExpectedExpenseId,
                      type: "expense",
                      deleted: expectedExpenseItem.Deleted
                  };
                  deferredExpenses.resolve(item);
                  expenses.push(item);
              });
          }).error(function (error) {
              console.log('Error getting expected expenses');
              deferredExpenses.reject();
          });

          return $q.all([deferredExpenses, deferredExpenses]);
      };

      self.deleteExpectedExpenses = function (expectedExpense) {
          $http.put(server + 'api/ExpectedExpenses/' + expectedExpense.expectedExpenseId, expectedExpense)
            .success(function (expectedExpenseData) {
            }).error(function (error) {
                console.log('Error: ', error);
            });
          var index = _.findIndex(expenses, 'name', expectedExpense.name);
          if (index > -1) {
              expenses.splice(index, 1);
          }
      };

      self.deleteExpectedIncomes = function (expectedIncome) {
          $http.put(server + 'api/ExpectedIncomes/' + expectedIncome.expectedIncomeId, expectedIncome)
            .success(function (expectedIncomeData) {
            }).error(function (error) {
                console.log('Error deleting expected incomes');
            });
          var index = _.findIndex(incomes, 'name', expectedIncome.name);
          if (index > -1) {
              incomes.splice(index, 1);
          }
      };

      self.isExpense = function (expenseName) {
          return (_.any(self.getExpensesFieldsWithoutValue(), { name: expenseName }));
      };

      self.isIncome = function (incomeName) {
          return (_.any(self.getIncomeFieldsWithoutValue(), { name: incomeName }));
      };

      self.getExpectedIncome = function () {
          return incomes;
      };

      self.getExpectedExpenses = function () {
          return expenses;
      };

      self.getExpectedExpenseId = function (expenseName) {
          return _.find(expenses, { name: expenseName }).id;
      };

      self.getExpectedIncomeId = function (incomeName) {
          return _.find(incomes, { name: incomeName }).id;
      };

      self.getExpensesFieldsWithoutValue = function () {
          var namesExpensesFields = [];
          self.getExpectedExpenses().forEach(function (expenseItem) {
              namesExpensesFields.push({ name: expenseItem.name, value: 0, id: expenseItem.id, type: "expense", deleted: expenseItem.deleted });
          });
          return namesExpensesFields;
      };

      self.getIncomeFieldsWithoutValue = function () {
          var namesIncomeFields = [];
          self.getExpectedIncome().forEach(function (incomeItem) {
              namesIncomeFields.push({ name: incomeItem.name, value: 0, id: incomeItem.id, type: "income", deleted: incomeItem.deleted });
          });
          return namesIncomeFields;
      };

      self.getTotalBenefitsExpected = function () {
          return _.sum(incomes, function (income) {
              return income.value;
          }) - _.sum(expenses, function (expense) {
              return expense.value;
          });
      };

      self.getTotalExpensesExpected = function () {
          return _.sum(expenses, function (expense) {
              return expense.value;
          });
      };

      self.updateExpectedExpenses = function (id, expenseToUpdate) {
          $http.put(server + 'api/ExpectedExpenses/' + id, expenseToUpdate).success(function (expenseData) {
          }).error(function (error) {
              console.log('Error updating expected expenses');
          });
      };

      self.updateExpectedIncomes = function (id, incomeToUpdate) {
          $http.put(server + 'api/ExpectedIncomes/' + id, incomeToUpdate).success(function (incomeData) {
          }).error(function (error) {
              console.log('Error updating expected incomes');
          });
      };

      self.saveExpectedIncome = function (incomeToStore) {
          $http.post('api/ExpectedIncomes',incomeToStore)
          .success(function (incomeData) {
              _.last(incomes).id = incomeData.ExpectedIncomeId;
              _.last(incomes).type = "income";
              _.last(incomes).deleted = incomeData.Deleted;
              _.last(incomes).name = incomeData.Name;
              _.last(incomes).value = incomeData.Value;
          }).error(function (error) {
              console.log('Error: ', error);
          });
      };

      self.saveExpectedExpense = function (expenseToStore) {
          $http.post('api/ExpectedExpenses', expenseToStore).success(function (expenseData) {
              _.last(expenses).id = expenseData.ExpectedExpenseId;
              _.last(expenses).type = "expense";
              _.last(expenses).deleted = expenseData.Deleted;
              _.last(expenses).name = expenseData.Name;
              _.last(expenses).value = expenseData.Value;
          }).error(function (error) {
              console.log('Error saving expected expenses');
          });
      };

      self.saveInstantData = function (valueToSave, categoryToSave, date) {
          if (_.any(incomes, categoryToSave)) {
              saveInstantIncome(valueToSave, categoryToSave, date);
              return;
          }
          if (_.any(expenses, categoryToSave)) {
              saveInstantExpense(valueToSave, categoryToSave, date);
          }
      };

      function saveInstantIncome(valueToSave, income, date) {
          var incomeToSave =
          {
              'value': valueToSave,
              'expectedIncome': { ExpectedIncomeId: income.id },
              'date': date
          };

          $http.post('api/Incomes',incomeToSave).success(function (incomeData) {
          }).error(function (error) {
              console.log('Error: ', error);
          });
      }

      function saveInstantExpense(valueToSave, expectedExpense, date) {
          var expenseToSave =
          {
              'value': valueToSave,
              'expectedExpense': { ExpectedExpenseId: expectedExpense.id },
              'date': date
          };

          $http.post('api/Expenses', expenseToSave).success(function (expenseData) {
          }).error(function (error) {
              console.log('Error saving instant expenses');
          });
      }
  }]);
