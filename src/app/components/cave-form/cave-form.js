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
        id: '=',
        onSave: '&',
        onCancel: '&'
      }
    });

  /** @ngInject */
  function CaveFormController($mdMedia, EnumRepository, CaveRepository) {
    var vm = this;

    vm.cave = isNew() ? {} : CaveRepository.find(vm.id);
    vm.$mdMedia = $mdMedia;
    vm.enums = {
      colors: EnumRepository.getEnum('colors'),
      effervescences: EnumRepository.getEnum('effervescences'),
      sizes: EnumRepository.getEnum('sizes'),
      types: EnumRepository.getEnum('types'),
      procurements: EnumRepository.getEnum('procurements')
    };

    vm.isNew = isNew;
    vm.save = save;
    vm.cancel = cancel;

    function isNew() {
      return !vm.id;
    }

    function save() {
      var promise;

      if (isNew()) {
        promise = CaveRepository.addCave(vm.cave);
      } else {
        promise = vm.cave.$save();
      }

      promise.then(function() {
        vm.onSave();
      });
    }

    function cancel() {
      vm.onCancel();
    }
  }

})();
