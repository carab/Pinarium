(function() {
  'use strict';

  angular
    .module('vinarium')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $translate, moment) {
    setMomentLocale($translate.use());

    $rootScope.$on('$translateChangeStart', function(event, locale) {
      setMomentLocale(locale.language);
    });

    function setMomentLocale(locale) {
      moment.locale(locale.toLowerCase());
    }
  }

})();
