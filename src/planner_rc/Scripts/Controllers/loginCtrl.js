/**
 * Created by Yolanda G E on 7/25/2015.
 */
'use strict';
angular.module('yoprojectAngularApp').controller('LoginCtrl', ['$scope', '$location', '$http', 'loginService', 'userService', function ($scope, $location, $http, loginService, userService) {
    $scope.signup = {};
    $scope.signup.buttonMessage = 'Sign up';
    $scope.signup.errorMessage = '';
    $scope.signup.isErrorCreatingUser = false;
    $scope.loginStatus = { isError: false };

    $scope.isDisabled = function () {
        return ($scope.username === undefined
        || $scope.password === undefined
        || $scope.username === ''
        || $scope.password === '');
    };

    $scope.login = function () {
      loginService.login($scope.username, $scope.password).then(onLoginSuccess,onLoginFailed);
    };

    $scope.register = function (isValid) {
        $scope.checkPasswordMatch();
        if (!isValid || $scope.signup.isErrorWithPasswordMatching) {
            return;
        }

        $http.post('/api/account/register', {
            Email: $scope.signup.user,
            Password: $scope.signup.pass
        }).success(function (data, status, headers, config) {
            $scope.signup.isUserCreated = true;
            $scope.signup.isShowForm = false;
            $scope.signup.buttonMessage = 'Sign up';
        }).error(function (data, status, headers, config) {
            $scope.signup.isErrorCreatingUser = true;
            var message = (_.isNull(data) || _.isUndefined(data.Message)) ? 'There\'s been an error' : data.Message;
            $scope.signup.errorMessage = message;
        });
    };

    $scope.toggleCreateUserForm = function () {
        resetFormData();

        $scope.signup.isShowForm = !$scope.signup.isShowForm;
        $scope.signup.buttonMessage = $scope.signup.isShowForm ? 'Hide' : 'Sign up';
    };

    $scope.checkPasswordMatch = function () {
        if ($scope.signup.pass !== $scope.signup.repeatedPass) {
            $scope.signup.isErrorWithPasswordMatching = true;
            return;
        }
        $scope.signup.isErrorWithPasswordMatching = false;
    };

    $scope.hideMessage = function () {
        $scope.signup.isErrorCreatingUser = false;
    };

    function resetFormData() {
        $scope.signup.isErrorCreatingUser = false;
        $scope.signup.isUserCreated = false;
        $scope.signup.isErrorWithPasswordMatching = false;
        $scope.signup.user = '';
        $scope.signup.pass = '';
        $scope.signup.repeatedPass = '';
    }

    function onLoginFailed(error) {
        $scope.loginStatus.isError = true;
  }

  function onLoginSuccess(){
      //dp nothing
    }

    function init() {
        if (loginService.loginStatus.isLogged) {
            $location.path('/');
        }
    }

    init();

    $scope.$watch(function () { return loginService.loginStatus.isLogged; }, function (newValue, oldValue) {
        if (newValue) {
            $location.path('/');
        }
    });
}]);
