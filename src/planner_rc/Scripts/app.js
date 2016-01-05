/**
 * @ngdoc overview
 * @name yoprojectAngularApp
 * @description
 * # yoprojectAngularApp
 *
 * Main module of the application.
 */
'use strict';

angular.module('yoprojectAngularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMessages',
    'ui.bootstrap',
    'datePicker'
])
  .factory('securityInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {

      //function checkAuthoritationError(data) {
      //    console.log('data', data);
      //    //if ($rootScope.route.current.$$route.requiresLogin &&
      //    //    rejection.data.indexOf('Account/Login') !== -1) {
      //    //      $rootScope.$broadcast('USER_UNAUTHENTICATED');
      //    //      return rejection;
      //    //  }
      //      return $q.reject(data);
      //    //return config;
      //}

      //  return {
      //      'responseError': checkAuthoritationError
      //  };

        //function checkAuthoritationError(rejection) {
        //    if ($rootScope.route.current.$$route.requiresLogin &&
        //        rejection.data.indexOf('Account/Login') !== -1) {
        //        $rootScope.$broadcast('USER_UNAUTHENTICATED');
        //        return rejection;
        //    }
        //    return $q.reject(rejection);
        //}

        //return {
        //    'responseError': checkAuthoritationError
        //};
  }])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/contact', {
            templateUrl: 'views/contact.html'
        })
        .when('/about', {
            templateUrl: 'views/about.html'
        })
        .when('/faq', {
            templateUrl: 'views/faq.html'
        })
        .when('/legal', {
            templateUrl: 'views/legal.html'
        })
        .when('/reset-password-request', {
            templateUrl: 'views/resetPasswordRequest.html',
            controller: 'ResetPasswordCtrl'
        })
        .when('/reset-by-token', {
             templateUrl: 'views/resetPassword.html',
             controller: 'ResetPasswordCtrl'
        })
        .when('/', {
            templateUrl: 'views/expectedSituation.html',
            controller: 'ExpectedSituationCtrl',
            requiresLogin: true
        })
        .when('/yearlyOverview', {
            templateUrl: 'views/yearlyOverview.html',
            controller: 'YearlyOverviewCtrl',
            requiresLogin: true
        })
        .when('/balanceDetail', {
            templateUrl: 'views/balanceDetail.html',
            controller: 'BalanceDetailCtrl',
            requiresLogin: true
        })
        .when('/dailySituation', {
            templateUrl: 'views/realDailySituation.html',
            controller: 'RealDailySituationCtrl',
            requiresLogin: true
        })
        .when('/instantEntry', {
            templateUrl: 'views/instantEntry.html',
            controller: 'InstantEntryCtrl',
            requiresLogin: true
        })
        .when('/account', {
            templateUrl: 'views/user.html',
            controller: 'UserCtrl',
            requiresLogin: true
        })
        .otherwise({
            redirectTo: '/'
        });

      //$httpProvider.interceptors.push('securityInterceptor');

      //authProvider.init({
      //  domain: 'financeplanner.auth0.com',
      //  clientID: 's04KK6TKrSoIXFKNdc6V3rDBhdqu6Etw',
      //  callbackURL: location.href,
      //  // Here we add the URL to go if the user tries to access a resource he can't because he's not authenticated
      //  loginUrl: '/login'
      //});

      //// We're annotating this function so that the `store` is injected correctly when this file is minified
      //jwtInterceptorProvider.tokenGetter = ['store', function (store) {
      //  // Return the saved token
      //  return store.get('token');
      //}];

      //$httpProvider.interceptors.push('jwtInterceptor');
  }])
  //  .run(['$rootScope', 'auth', 'store', 'jwtHelper', '$location', 'loginService', function ($rootScope, auth, store, jwtHelper, $location, loginService) {
  //  // This hooks al auth events to check everything as soon as the app starts
  //  auth.hookEvents();
  //  // This events gets triggered on refresh or URL change
  //  $rootScope.$on('$locationChangeStart', function () {
  //    var token = store.get('token');
  //    if (token) {
  //      if (!jwtHelper.isTokenExpired(token)) {
  //        if (!auth.isAuthenticated) {
  //          auth.authenticate(store.get('profile'), token).then(function () {
  //            loginService.setIsLogged(true);
  //          }, function () {
  //            auth.signout();
  //            store.remove('profile');
  //            store.remove('token');
  //            loginService.setIsLogged(false);
  //          });
  //          return;
  //        }
  //        return;
  //      }
  //      store.remove('profile');
  //      store.remove('token');
  //      loginService.setIsLogged(false);

  //    }
  //  });
  //}])
  .directive("leftPanel", function () {
      return {
          restrict: "E",
          templateUrl: '../views/leftPanel.html',
          controller: 'LeftPanelCtrl'
      }
  })
  .directive('contenteditable', function () {
      return {
          restrict: 'A',
          require: '?ngModel',
          link: function (scope, element, attrs, ngModel) {
              if (!ngModel) return;

              // Specify how UI should be updated
              ngModel.$render = function () {
                  element.html(ngModel.$viewValue || '');
              };

              element.on('keypress', function (evt) {
                  if (evt.keyCode == 13) {
                      evt.preventDefault();
                      evt.stopPropagation();
                      element.blur();
                  }
              });

              // Listen for change events to enable binding
              element.on('blur keyup change', function () {
                  scope.$apply(readViewText);
              });

              // No need to initialize, AngularJS will initialize the text based on ng-model attribute
              // Write data to the model
              function readViewText() {
                  var html = element.html();

                  if (attrs.stripBr && _.contains(html, '<br>')) {
                      html = html.replace(/<br>/g, '');
                  }
                  if (attrs.stripBr && _.contains(html, '&nbsp;')) {
                      html = html.replace(/&nbsp;/g, '');
                  }
                  if (attrs.stripBr && _.contains(html, 'nbsp;')) {
                      html = html.replace(/nbsp;/g, '');
                  }
                  if (attrs.stripBr && _.contains(html, 'amp;')) {
                      html = html.replace(/amp;/g, '');
                  }
                  if (attrs.stripBr && _.contains(html, '&amp;')) {
                      html = html.replace(/&amp;/g, '');
                  }
                  ngModel.$setViewValue(html);
              }
          }
      };
  })
  .directive('convertToNumber', function () {
      return {
          require: 'ngModel',
          link: function (scope, element, attrs, ngModel) {
              ngModel.$parsers.push(function (val) {
                  return parseInt(val, 10);
              });
              ngModel.$formatters.push(function (val) {
                  return '' + val;
              });
          }
      };
  });
