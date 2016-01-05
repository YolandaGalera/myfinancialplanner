/**
 * Created by Yolanda on 16-Sep-15.
 */
'use strict';
angular.module('yoprojectAngularApp').directive('validatePassword', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {

      ctrl.$validators.validatePassword = function (password) {
        if (_.isNull(password) || _.isUndefined(password)) {
          return password;
        }

        function containsUpperLetter(password) {
          return password.match(/[A-Z]/) != null;
        }

        function containsLowerLetter(password) {
            return password.match(/[a-z]/) != null;
        }

        function containsDigit(password) {
          return password.match(/[0-9]/) != null;
        }

        function containsSymbol(password) {
            return password.match(/[-!$%^&@*()_+|~=`{}\[\]:";'<>?,.\/]/) != null;
        }

        function hasCorrectLength(password) {
          return password.length >= 6 && password.length < 255;
        }

        var containsUpperLetter = containsUpperLetter(password);
        var containsLowerLetter = containsLowerLetter(password);
        var containsDigit = containsDigit(password);
        var hasCorrectLength = hasCorrectLength(password);
        var containsSymbol = containsSymbol(password);

        ctrl.$setValidity('containsUpperLetter', containsUpperLetter);
        ctrl.$setValidity('containsLowerLetter', containsLowerLetter);
        ctrl.$setValidity('containsdigit', containsDigit);
        ctrl.$setValidity('hascorrectlength', hasCorrectLength);
        ctrl.$setValidity('containsSymbol', containsSymbol);

        return password;
      };
    }
  };
});

