/**
 * Created by Yolanda G E on 7/28/2015.
 */
'use strict';

angular.module('yoprojectAngularApp')
  .service('loginService', ['$location', '$http', '$rootScope', '$q', 'userService', function ($location, $http, $rootScope, $q, userService) {
      var self = this;
      var isLoginError = false;
      self.loginStatus = { isLogged: false };

      self.setIsLogged = function (isLogged) {
          self.loginStatus.isLogged = isLogged;
          if (!self.loginStatus.isLogged) {
              $location.path('/login');
          }
      };

      self.login = function (email, password) {
          var defer = $q.defer();
          $http.post('api/account/login', { Email: email, Password: password })
            .success(loginSucceedFunction(defer))
            .error(loginErrorFunction(defer));

          return defer.promise;
      };

      self.logout = function () {
          $http({
              url: 'api/account/logout',
              method: 'POST'
          })
          $location.path('/login');
      };

      function loginToFalse() {
          self.setIsLogged(false);
      }

      function loginSucceedFunction(defer) {
          return function () {
              defer.resolve();
              self.setIsLogged(true);
              $location.path('/');
              userService.loadUser();
          };
      }

      function loginErrorFunction(defer) {
          return function () {
              defer.reject();
          }
      }

      $rootScope.$on('USER_UNAUTHENTICATED', loginToFalse)

  }]);
