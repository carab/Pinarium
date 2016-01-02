(function() {
  'use strict';

  angular
    .module('vinarium')
    .config(config)
    .config(material)
    .config(translate);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

  /** @ngInject */
  function material($mdThemingProvider) {
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
})();
