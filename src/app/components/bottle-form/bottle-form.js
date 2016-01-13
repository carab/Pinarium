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
        id: '=',
        onSave: '&',
        onCancel: '&'
      }
    });

  /** @ngInject */
  function BottleFormController($mdMedia, EnumRepository, BottleRepository, CaveRepository) {
    var vm = this;

    vm.bottle = isNew() ? BottleRepository.getDefault() : BottleRepository.getOne(vm.id);
    vm.$mdMedia = $mdMedia;
    vm.enums = EnumRepository.getEnums();
    vm.caves = CaveRepository.getCaves();

    vm.isNew = isNew;
    vm.save = save;
    vm.cancel = cancel;

    function isNew() {
      return !vm.id;
    }

    function save() {
      var promise;

      if (isNew()) {
        promise = BottleRepository.add(vm.bottle);
      } else {
        promise = BottleRepository.save(vm.bottle);
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
