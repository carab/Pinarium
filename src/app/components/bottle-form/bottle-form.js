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

    vm.save = save;
    vm.cancel = cancel;
    vm.isNew = isNew;
    vm.isSort = isSort;

    activate();

    function activate() {
      vm.$mdMedia = $mdMedia;
      vm.bottle = isNew() ? BottleRepository.getDefault({ sort: vm.sort }) : BottleRepository.find(vm.id);
      vm.enums = EnumRepository.get();
      vm.caves = CaveRepository.get();

      if (!isNew()) {
        vm.bottle.$loaded(function () {
          BottleRepository.afterLoad(vm.bottle);
        });
      } else {
        BottleRepository.afterLoad(vm.bottle);
      }
    }

    function isSort(sort) {
      return (vm.bottle.sort === sort);
    }

    function isNew() {
      return !vm.id;
    }

    function save() {
      var promise;

      BottleRepository.beforeSave(vm.bottle);

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
