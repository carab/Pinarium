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
      .useStaticFilesLoader({
        prefix: '/app/languages/',
        suffix: '.json'
        })
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
  function router($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/auth');

  $stateProvider
    .state('auth', {
      url: '/auth',
      template: '<auth layout layout-fill></auth>'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      template: '<main layout layout-fill></main>',
      resolve: {
        'auth': ['Auth', function(Auth) {
          return Auth.$requireAuth();
        }]
      }
    })

    .state('app.bottles', {
      url: '',
      template: '<bottle-list></bottle-list>'
    })

    .state('app.bottles.add', {
      url: '/add',
      resolve: {
        /** ngInject */
        event: function($stateParams) {
          return $stateParams.event;
        }
      },
      /** ngInject */
      onEnter: function($state, BottleFormDialog) {
        BottleFormDialog.show(event).finally(function() {
          $state.go('^');
        });
      },
      /** ngInject */
      onExit: function(BottleFormDialog) {
        BottleFormDialog.close();
      }
    })

    .state('app.bottles.edit', {
      url: '/edit/:id',
      resolve: {
        /** ngInject */
        event: function($stateParams) {
          return $stateParams.event;
        }
      },
      /** ngInject */
      onEnter: function($state, $stateParams, BottleFormDialog) {
        BottleFormDialog.show(event, $stateParams.id).finally(function() {
          $state.go('^');
        });
      },
      /** ngInject */
      onExit: function(BottleFormDialog) {
        BottleFormDialog.close();
      }
    })

    .state('app.caves', {
      url: '/caves',
      template: '<cave-list></cave-list>'
    })

    .state('app.caves.add', {
      url: '/add',
      onEnter: ['$document', '$stateParams', '$state', '$mdDialog', function($document, $stateParams, $state, $mdDialog) {
        $mdDialog.show({
          ariaLabel: 'test',
          template: '<cave-form></cave-form>',
          parent: angular.element($document.body)
        }).finally(function() {
            $state.go('^');
        });
      }]
    });
  }
})();
