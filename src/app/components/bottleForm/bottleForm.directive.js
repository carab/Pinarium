(function() {
  'use strict';

  angular
    .module('vinarium')
    .directive('bottleForm', bottleForm);

  /** @ngInject */
  function bottleForm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/bottleForm/bottleForm.html',
      scope: {},
      controller: bottleFormController,
      controllerAs: 'vm',
      bindToController: {
        bottle: '=',
        submit: '&',
        cancel: '&'
      }
    };

    return directive;

    /** @ngInject */
    function bottleFormController($mdMedia, EnumRepository) {
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
  }

})();
