/**
 * Created by Yolanda G E on 30/08/2015.
 */

angular.module('yoprojectAngularApp').service('userService', ['$http', '$q', '$rootScope', '$location', 'server', function ($http, $q, $rootScope, $location, server) {
    var self = this;
    var user = {
        username: null,
        email: null,
        country: null,
        birthday: null
    };

    var isUserLoadNeeded = true;

    self.loadUser = function () {
        var deferred = $q.defer();
        $http.get('api/account/user').success(function (userData) {
            console.log('USER loaded')
            if (_.isUndefined(userData.Id)) {
                deferred.reject();
                return;
            }
            user.id = userData.Id;
            user.username = userData.UserName;
            user.email = userData.Email;
            user.country = userData.Country;
            user.birthday = userData.Birthday;
            isUserLoadNeeded = false;
            deferred.resolve(user);
        }).error(function () {
            if ($location.path() !== '/reset-by-token') {
                $rootScope.$broadcast('USER_UNAUTHENTICATED');
            }
            deferred.reject();
        }
        );
        return deferred.promise;
    };

    self.loadUserIfNeeded = function () {
        if (isUserLoadNeeded) {
            return self.loadUser();
        }
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
    };

    self.updateUser = function (user) {
        var deferred = $q.defer();
        $http.put('/api/account/updateuser/' + user.id, user).success(function () {
            deferred.resolve({});
        });
        return deferred.promise;
    };

    self.resetPassword = function (oldPassword, newPassword) {
        var deferred = $q.defer();
        var newCredentials = { OldPassword: oldPassword, NewPassword: newPassword };
        $http.post('/api/account/updatepassword', newCredentials).success(function () {
            deferred.resolve({});
        }).error(function () {
            deferred.reject();
        });
        return deferred.promise;
    };

    self.resetForgottenPasswordRequest = function (email) {
        var deferred = $q.defer();
        $http.post('/api/account/reset-forgotten-password-request', { email: email }).success(function () {
            deferred.resolve({});
        }).error(function () {
            deferred.reject();
        });
        return deferred.promise;
    };

    self.resetForgottenPassword = function (email, password, token) {
        var deferred = $q.defer();
        $http.post('/api/account/reset-forgotten-password', { email: email, password: password, token: token }).success(function () {
            deferred.resolve({});
        }).error(function () {
            deferred.reject();
        });
        return deferred.promise;
    };

    self.getUser = function () {
        return user;
    };
}]);
