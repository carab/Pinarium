(function() {
  'use strict';

  angular
    .module('vinarium')
    .config(log)
    .config(theme)
    .config(translate)
    .config(datepicker);

  /** @ngInject */
  function log($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
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
})();
