(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('bottleForm', {
    	restrict: 'EA',
    	templateUrl: 'app/components/bottle-form/bottle-form.html',
    	controller: BottleFormController,
      controllerAs: 'vm',
      bindings: {
        bottle: '=',
        submit: '&',
        cancel: '&'
      }
    });

  /** @ngInject */
  function BottleFormController($mdMedia, EnumRepository) {
    var vm = this;

    vm.$mdMedia = $mdMedia;
    vm.enums = {
      colors: EnumRepository.getEnum('colors'),
      effervescences: EnumRepository.getEnum('effervescences'),
      sizes: EnumRepository.getEnum('sizes'),
      types: EnumRepository.getEnum('types'),
      procurements: EnumRepository.getEnum('procurements')
    };

    vm.isNew = isNew;

    function isNew() {
      return (typeof vm.bottle.$id === 'undefined');
    }
  }
})();
