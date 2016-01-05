(function() {
  'use strict';

  angular
    .module('vinarium')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $state, $translate, moment, Auth) {
    setMomentLocale($translate.use());

    $rootScope.$on('$translateChangeStart', function(event, locale) {
      setMomentLocale(locale.language);
    });

    function setMomentLocale(locale) {
      moment.locale(locale.toLowerCase());
    }

    $rootScope.$on('$stateChangeError', function(event, next, previous, error, test) {
      Auth.$requireAuth().catch(function() {
        $state.go('auth');
      });
    });
  }

})();
