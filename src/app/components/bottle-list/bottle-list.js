(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('bottleList', {
      restrict: 'EA',
      templateUrl: 'app/components/bottle-list/bottle-list.html',
      controller: BottleListController,
      controllerAs: 'vm',
      bindings: {
        sort: '='
      }
    });

  /** @ngInject */
  function BottleListController($document, $mdDialog, $mdMedia, $state, $stateParams, $translate, BottleRepository, CaveRepository) {
    var vm = this;
    
    vm.editBottle = editBottle;
    vm.removeBottle = removeBottle;
    vm.removeSelectedBottles = removeSelectedBottles;

    activate();

    function activate() {
      vm.loaded = false;
      vm.selectedBottles = [];
      vm.bottles = BottleRepository.get();
      vm.promise = vm.bottles.$loaded(function (bottles) {
        vm.loaded = true;
        loadBottlesCave(bottles);
      });
    }

    function loadBottlesCave(bottles) {
      angular.forEach(bottles, function(bottle) {
        if (angular.isString(bottle.cave)) {
          bottle.cave = CaveRepository.getCave(bottle.cave);
        }
      });
    }

    function editBottle(bottle, event) {
      $state.go('app.edit.bottle', {
        id: bottle.$id,
        event: event
      });
    }

    function removeBottle(bottle, ev) {
      $translate(['bottle.deleteAsk', 'bottle.delete', 'label.yes', 'label.no'], {
        count: 1
      }).then(function (translations) {
        var confirm = $mdDialog.confirm()
          .title(translations['bottle.deleteAsk'])
          .textContent(bottle.appellation)
          .clickOutsideToClose(true)
          .ariaLabel(translations['bottle.delete'])
          .targetEvent(ev)
          .ok(translations['label.yes'])
          .cancel(translations['label.no']);

        $mdDialog.show(confirm).then(function() {
          vm.bottles.$remove(bottle);
        });
      });
    }

    function removeSelectedBottles(ev) {
      $translate(['bottle.deleteAsk', 'bottle.delete', 'label.yes', 'label.no'], {
        count: vm.selectedBottles.length
      }).then(function (translations) {
        var confirm = $mdDialog.confirm()
          .title(translations['bottle.deleteAsk'])
          .clickOutsideToClose(true)
          .ariaLabel(translations['bottle.delete'])
          .targetEvent(ev)
          .ok(translations['label.yes'])
          .cancel(translations['label.no']);

        $mdDialog.show(confirm).then(function() {
          angular.forEach(vm.selectedBottles, function(bottle) {
            vm.bottles.$remove(bottle);
          });
          vm.selectedBottles.length = 0;
        });
      });
    }
  }

})();
