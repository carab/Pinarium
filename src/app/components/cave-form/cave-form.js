(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('caveForm', {
    	restrict: 'EA',
    	templateUrl: 'app/components/cave-form/cave-form.html',
    	controller: CaveFormController,
      controllerAs: 'vm',
      bindings: {
        cave: '=',
        submit: '&',
        cancel: '&'
      }
    });

  /** @ngInject */
  function CaveFormController($mdMedia, EnumRepository) {
    var vm = this;

  }
})();
