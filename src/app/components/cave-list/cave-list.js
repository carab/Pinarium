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

    vm.caves = CaveRepository.getCaves();

    vm.editCave = editCave;
    vm.addCave = addCave;
    vm.getBottlesTotal = getBottlesTotal;

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

    var bottlesTotals = {};
    function getBottlesTotal(cave) {
      if (!bottlesTotals[cave.$id]) {
        bottlesTotals[cave.$id] = 0;
        BottleRepository.getByCave(cave.$id).$loaded(function (bottles) {
          angular.forEach(bottles, function (bottle) {
            bottlesTotals[cave.$id] += bottle.quantity;
          });
        });
      }

      return bottlesTotals[cave.$id];
    }
  }
})();
