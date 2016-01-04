(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('uiFab', {
    	restrict: 'EA',
    	templateUrl: 'app/components/ui-fab/ui-fab.html',
    	controller: UiFabController,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function UiFabController($document, $mdDialog, $mdMedia, $translate) {
    var vm = this;

    vm.addBottle = addBottle;

    function addBottle(ev) {
      $translate(['bottle.add']).then(function (translations) {
        $mdDialog.show({
          ariaLabel: translations['bottle.add'],
          controller: addBottleController,
          controllerAs: 'vm',
          template: '<bottle-form layout="column" layout-fill bottle="vm.bottle" submit="vm.save()" cancel="vm.close()"></bottle-form>',
          parent: angular.element($document.body),
          locals: {},
          targetEvent: ev,
          fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
        });

        /** @ngInject */
        function addBottleController($mdDialog, BottleRepository) {
          var vm = this;

          vm.bottle = {};

          vm.save = save;
          vm.close = close;

          function save() {
            BottleRepository.addBottle(vm.bottle).then(function() {
              $mdDialog.hide();
            });
          }

          function close() {
            $mdDialog.cancel();
          }
        }
      });
    }
  }

})();
