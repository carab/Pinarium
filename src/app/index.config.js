(function() {
  'use strict';

  angular
    .module('vinarium')
    .config(log)
    .config(location)
    .config(theme)
    .config(translate)
    .config(datepicker)
    .config(router);

  /** @ngInject */
  function log($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

  /** @ngInject */
  function location($locationProvider) {
    $locationProvider.html5Mode(true);
  }

  /** @ngInject */
  function theme($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('blue');
  }

  /** @ngInject */
  function translate($translateProvider, AvailableLanguages) {
    $translateProvider
      .useSanitizeValueStrategy('sanitizeParameters')
      .useLocalStorage()
      .useMessageFormatInterpolation()
      .registerAvailableLanguageKeys(AvailableLanguages)
      .determinePreferredLanguage()
      .fallbackLanguage(AvailableLanguages[0]);
  }

  /** @ngInject */
  function datepicker($mdDateLocaleProvider, moment) {
    $mdDateLocaleProvider.firstDayOfWeek = 1;

    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'L', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    $mdDateLocaleProvider.formatDate = function(date) {
      if (angular.isDefined(date)) {
        return moment(date).format('L');
      } else {
        return null;
      }
    };

    //$mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
    //  return 'Semaine ' + weekNumber;
    //};
    //$mdDateLocaleProvider.msgCalendar = 'Calendrier';
    //$mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';
  }

  /** @ngInject */
  function router($stateProvider, $urlRouterProvider, $transitionsProvider) {
    $urlRouterProvider.otherwise('/app');

    $transitionsProvider.onStart({
      to: function(state) {
        return state.requiresAuth;
      }
    }, requiresAuth);

    $transitionsProvider.onStart({
      to: function(state) {
        return state.requiresUnauth;
      }
    }, requiresUnauth);

    /** @ngInject */
    function requiresAuth($state, Auth) {
      return Auth.$requireAuth().catch(function() { return $state.go('auth'); });
    }

    /** @ngInject */
    function requiresUnauth($state, $q, Auth) {
      var deferred = $q.defer();

      Auth.$requireAuth()
        .then(function (data) { deferred.reject(data) })
        .catch(function (data) { deferred.resolve(data) });

      return deferred.promise.catch(function() { return $state.go('app.bottles'); });
    }

    $stateProvider
      .state('auth', {
        url: '/auth',
        requiresUnauth: true,
        template: '<auth layout layout-fill></auth>'
      })

      .state('app', {
        url: '/app',
        abstract: true,
        requiresAuth: true,
        template: '<main layout layout-fill></main>'
      })

      .state('app.bottles', {
        url: '',
        requiresAuth: true,
        template: '<bottle-list></bottle-list>'
      })

      .state('app.bottles.add', {
        url: '/add',
        requiresAuth: true,
        params: {
          event: null
        },
        /** @ngInject */
        onEnter: function($state, $stateParams, BottleFormDialog) {
          BottleFormDialog.show($stateParams.event).finally(function() {
            $state.go('^');
          });
        },
        /** @ngInject */
        onExit: function(BottleFormDialog) {
          BottleFormDialog.close();
        }
      })

      .state('app.bottles.edit', {
        url: '/edit/:id',
        requiresAuth: true,
        params: {
          event: null
        },
        /** @ngInject */
        onEnter: function($state, $stateParams, BottleFormDialog) {
          BottleFormDialog.show($stateParams.event, $stateParams.id).finally(function() {
            $state.go('^');
          });
        },
        /** @ngInject */
        onExit: function(BottleFormDialog) {
          BottleFormDialog.close();
        }
      })

      .state('app.caves', {
        url: '/caves',
        requiresAuth: true,
        template: '<cave-list></cave-list>'
      })

      .state('app.caves.add', {
        url: '/add',
        requiresAuth: true,
        params: {
          event: null
        },
        /** @ngInject */
        onEnter: function($state, $stateParams, CaveFormDialog) {
          CaveFormDialog.show($stateParams.event).finally(function() {
            $state.go('^');
          });
        },
        /** @ngInject */
        onExit: function(CaveFormDialog) {
          CaveFormDialog.close();
        }
      })

      .state('app.caves.edit', {
        url: '/edit/:id',
        requiresAuth: true,
        params: {
          event: null
        },
        /** @ngInject */
        onEnter: function($state, $stateParams, CaveFormDialog) {
          CaveFormDialog.show($stateParams.event, $stateParams.id).finally(function() {
            $state.go('^');
          });
        },
        /** @ngInject */
        onExit: function(CaveFormDialog) {
          CaveFormDialog.close();
        }
      });
  }
})();
