/**
 * Created by Yolanda on 18-Aug-15.
 */
'use strict';

angular.module('yoprojectAngularApp').controller('UserCtrl', ['$scope', '$modal', '$timeout', 'userService', function ($scope, $modal, $timeout, userService) {
  $scope.panel = userService.getUser();
  $scope.password = null;
  $scope.showSaved = false;
  $scope.modalInstance = undefined;
  $scope.arePasswordsEquals = true;
  $scope.passwordsEqualsMessage = null;
  $scope.data = { oldPassword: null, newPassword: null, repeatedNewPassword: null };

  if ($scope.panel.birthday === '0001-01-01T00:00:00' || $scope.panel.birthday === null || $scope.panel.birthday === undefined) {
      $scope.panel.birthday = '';
  }

  $scope.updateUser = function (isValid) {
    if (!isValid) {
      return;
    }
    if (!_.isNull($scope.password)) {
      $scope.panel.newPassword = $scope.password;
    }
    var user = {
      id: $scope.panel.id,
      username: $scope.panel.username,
      email: $scope.panel.email,
      country: $scope.panel.country,
      birthday: $scope.panel.birthday,
      newPassword: $scope.panel.newPassword,
      self: $scope.panel.self
    };

    userService.updateUser(user).then(function () {
        $scope.showSaved = true;
        $timeout(function () {
            $scope.showSaved = false;
        }, 3000);
    });
  };

  $scope.updatePassword = function () {
      $scope.open('sm');
  };

  $scope.open = function (size) {
      $scope.modalInstance = $modal.open({
          scope: $scope,
          animation: true,
          templateUrl: '../views/changePassword.html',
          size: size
      });
  };

  $scope.cancel = function () {
      $scope.modalInstance.dismiss('cancel');
  };

  $scope.confirmUpdatePassword = function (event, isValid) {
      if (!isValid) {
          return;
      }
      $scope.arePasswordsEquals = $scope.data.newPassword === $scope.data.repeatedNewPassword;
      if (!$scope.arePasswordsEquals) {
          $scope.passwordsEqualsMessage = 'Passwords must be equals';
          return;
      }
      $scope.passwordsEqualsMessage = null;
      userService.resetPassword($scope.data.oldPassword, $scope.data.newPassword);
      $scope.modalInstance.close();
  }


    $scope.$watch('panel.birthday', function () {
        if ($scope.panel.birthday === '0001-01-01T00:00:00' || $scope.panel.birthday === null || $scope.panel.birthday === undefined) {
            $scope.panel.birthday = '';
        }
    });
  }
  ]);