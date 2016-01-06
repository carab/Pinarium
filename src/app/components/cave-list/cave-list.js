(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('caveList', {
    	restrict: 'EA',
    	templateUrl: 'app/components/cave-list/cave-list.html',
    	controller: CaveListController,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function CaveListController($state, CaveRepository, BottleRepository) {
    var vm = this;

    vm.editCave = editCave;
    vm.addCave = addCave;

    activate();

    function activate() {
      vm.caves = CaveRepository.getCaves();

      vm.caves.$loaded(function (caves) {
        loadCavesQuantity(caves);
      });
    }

    function editCave(cave, event) {
      $state.go('app.caves.edit', {
        id: cave.$id,
        event: event
      });
    }

    function addCave(event) {
      $state.go('app.caves.add', {
        event: event
      });
    }

    function loadCavesQuantity(caves) {
      angular.forEach(caves, function (cave) {
        cave.quantity = 0;
        BottleRepository.getByCave(cave.$id).$loaded(function (bottles) {
          angular.forEach(bottles, function (bottle) {
            cave.quantity += bottle.quantity;
          });
        });
      });
    }
  }
})();
