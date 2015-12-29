(function() {
  'use strict';

  angular
    .module('vinarium')
    .directive('bottleList', bottleList);

  /** @ngInject */
  function bottleList() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/bottleList/bottleList.html',
      scope: {
          creationDate: '='
      },
      controller: bottleListController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function bottleListController($mdDialog, $mdMedia, $document, BottleRepository) {
      var vm = this;

      vm.selectedBottles = [];
      vm.bottles = BottleRepository.getBottles();

      vm.editBottle = editBottle;
      vm.removeBottle = removeBottle;
      vm.removeSelectedBottles = removeSelectedBottles;

      function editBottle(bottle, ev) {
        $mdDialog.show({
          controller: editBottleController,
          controllerAs: 'vm',
          template: '<bottle-form layout="column" layout-fill bottle="vm.bottle" submit="vm.save()" cancel="vm.close()"></bottle-form>',
          parent: angular.element($document.body),
          locals: {
            bottle: bottle,
            bottles: vm.bottles
          },
          targetEvent: ev,
          fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
        });

        /** @ngInject */
        function editBottleController($mdDialog, $mdMedia, bottle, bottles) {
          var vm = this;

          vm.bottle = bottle;
          vm.$mdMedia = $mdMedia;

          vm.save = save;
          vm.close = close;

          function save() {
            bottles.$save(bottle).then(function() {
              $mdDialog.hide();
            });
          }

          function close() {
            $mdDialog.cancel();
          }
        }
      }

      function removeBottle(bottle, ev) {
        var confirm = $mdDialog.confirm()
          .title('Delete the following bottle ?')
          .textContent(bottle.appellation)
          .clickOutsideToClose(true)
          .ariaLabel('Delete a bottle')
          .targetEvent(ev)
          .ok('Yes, delete it')
          .cancel('No');

        $mdDialog.show(confirm).then(function() {
          vm.bottles.$remove(bottle);
        });
      }

      function removeSelectedBottles(ev) {
        var confirm = $mdDialog.confirm()
          .title('Do you really want to delete ' + vm.selectedBottles.length + ' bottles ?')
          .clickOutsideToClose(true)
          .ariaLabel('Delete a bottle')
          .targetEvent(ev)
          .ok('Yes, delete it')
          .cancel('No');

        $mdDialog.show(confirm).then(function() {
          angular.forEach(vm.selectedBottles, function(bottle) {
            vm.bottles.$remove(bottle);
          });
          vm.selectedBottles.length = 0;
        });
      }
    }
  }

})();
