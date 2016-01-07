(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('notFound', {
      restrict: 'EA',
      templateUrl: 'app/components/not-found/not-found.html',
      controller: NotFoundController
    });

  /** @ngInject */
  function NotFoundController() {

  }
  
})();
