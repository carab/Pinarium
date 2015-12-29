(function() {
  'use strict';

  angular
    .module('vinarium')
    .directive('uiFab', uiFab);

  /** @ngInject */
  function uiFab() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/uiFab/uiFab.html',
      scope: {},
      controller: uiFabController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function uiFabController($mdDialog, $mdMedia, $document) {
      var vm = this;

      vm.addBottle = addBottle;

      function addBottle(ev) {
        $mdDialog.show({
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

          function save(isValid) {
            if (isValid) {
              BottleRepository.addBottle(vm.bottle).then(function() {
                $mdDialog.hide();
              });
            }
          }

          function close() {
            $mdDialog.cancel();
          }
        }
      }
    }
  }

})();
