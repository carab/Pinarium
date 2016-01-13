(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('uiFab', {
      restrict: 'EA',
      templateUrl: 'app/components/ui-fab/ui-fab.html',
      controller: UiFabController,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function UiFabController($state) {
    this.$state = $state;
  }

  UiFabController.prototype.addBottle = function(sort, event) {
    this.$state.go('app.add.bottle', {
      sort: sort,
      event: event
    });
  }

})();
