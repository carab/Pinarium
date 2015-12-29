(function() {
  'use strict';

  angular
    .module('vinarium')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
