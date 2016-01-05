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
  }
})();
