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
  function BottleFormController($mdMedia, EnumRepository, BottleRepository, CaveRepository, AutocompleteRepository) {
    var vm = this;

    vm.save = save;
    vm.cancel = cancel;
    vm.isNew = isNew;
    vm.isSort = isSort;

    activate();

    function activate() {
      vm.$mdMedia = $mdMedia;
      vm.enums = EnumRepository.get();
      vm.caves = CaveRepository.get();
      vm.autocompletes = AutocompleteRepository.get();

      if (isNew()) {
        vm.bottle = BottleRepository.getDefault({ sort: vm.sort });
      } else {
        vm.bottle = {};
        vm.originalBottle = BottleRepository.find(vm.id);
        
        vm.originalBottle.$loaded().then(function(bottle) {
          vm.bottle = angular.extend({}, bottle);
          BottleRepository.afterLoad(vm.bottle);
        });
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

      if (isNew()) {
        var bottle = angular.extend({}, vm.bottle);
        promise = BottleRepository.add(bottle);
      } else {
        angular.extend(vm.originalBottle, vm.bottle);
        promise = BottleRepository.save(vm.originalBottle);
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
