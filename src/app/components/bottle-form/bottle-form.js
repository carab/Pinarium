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
        sort: '=',
        onSave: '&',
        onCancel: '&'
      }
    });

  /** @ngInject */
  function BottleFormController($mdMedia, EnumRepository, BottleRepository, CaveRepository) {
    var vm = this;

    vm.bottle = isNew() ? BottleRepository.getDefault({ sort: vm.sort }) : BottleRepository.getOne(vm.id);
    vm.$mdMedia = $mdMedia;
    vm.enums = EnumRepository.getEnums();
    vm.caves = CaveRepository.getCaves();

    vm.save = save;
    vm.cancel = cancel;
    vm.isNew = isNew;
    vm.isSort = isSort;

    function isSort(sort) {
      return (vm.bottle.sort === sort);
    }

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
