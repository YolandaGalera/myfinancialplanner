/**
 * Created by Yolanda on 06-Sep-15.
 */
'use strict';
angular.module('yoprojectAngularApp').controller('ResetPasswordCtrl', ['$scope', '$location', '$timeout', '$routeParams', 'userService', 'loginService', function ($scope, $location, $timeout, $routeParams, userService, loginService) {
    $scope.isEmailSent = false;
    $scope.arePasswordsEquals = true;
    $scope.passwordsEqualsMessage = null;
    $scope.isEmailFalse = false;
    $scope.isPasswordChanged = false;
    loginService.loginStatus.isLogged = false;

    $scope.resetForgottenPasswordRequest = function (isValid) {
        if (!isValid) {
            return;
        }
        $scope.isEmailSent = false;
        $scope.isEmailFalse = false;
        $scope.arePasswordsEquals = $scope.password === $scope.repeatedPassword;
        if (!$scope.arePasswordsEquals) {
            $scope.passwordsEqualsMessage = 'Passwords must be equals.';
            return;
        }
        $scope.passwordsEqualsMessage = null;
        resetForgottenPasswordRequest();
    };

    $scope.resetForgottenPassword = function (isValid) {
        $scope.isEmailSent = false;
        $scope.isEmailFalse = false;
        if (!isValid) {
            return;
        }
        $scope.arePasswordsEquals = $scope.password === $scope.repeatedPassword;
        if (!$scope.arePasswordsEquals) {
            $scope.passwordsEqualsMessage = 'Passwords must be equals.';
            return;
        }
        $scope.passwordsEqualsMessage = null;
        resetForgottenPassword();
    };

    function resetForgottenPasswordRequest() {
        userService.resetForgottenPasswordRequest($scope.email).then(function () {
            $scope.isEmailSent = true;
        }, function () {
            $scope.isEmailFalse = true;
        });
    }

    function resetForgottenPassword() {
        var token = getToken();
        var email = getEmail();
        userService.resetForgottenPassword(email, $scope.password, token).then(function () {
            $scope.isEmailSent = true;
            $scope.isPasswordChanged = true;
            $timeout(redirect, 5000);
        }, function () {
            $scope.isEmailFalse = true;
            $scope.isPasswordChanged = false;
        });
    }

    function redirect() {
        $location.path('/login');
    }

    function getToken() {
            return $routeParams.token;
    }

    function getEmail() {
        return $routeParams.email;
    }
}]);
