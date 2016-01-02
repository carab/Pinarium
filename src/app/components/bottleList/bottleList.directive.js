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
    function bottleListController($document, $mdDialog, $mdMedia, $translate, BottleRepository) {
      var vm = this;

      vm.loaded = false;
      vm.selectedBottles = [];
      vm.bottles = BottleRepository.getBottles();
      vm.bottles.$loaded(function () {
        vm.loaded = true;
      });

      vm.editBottle = editBottle;
      vm.removeBottle = removeBottle;
      vm.removeSelectedBottles = removeSelectedBottles;

      function editBottle(bottle, ev) {
        $translate(['bottle.edit']).then(function (translations) {
          $mdDialog.show({
            ariaLabel: translations['bottle.edit'],
            controller: editBottleController,
            controllerAs: 'vm',
            template: '<bottle-form layout="column" layout-fill bottle="vm.bottle" submit="vm.save(isValid)" cancel="vm.close()"></bottle-form>',
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

            function save(isValid) {
              if (isValid) {
                bottles.$save(bottle).then(function() {
                  $mdDialog.hide();
                });
              }
            }

            function close() {
              $mdDialog.cancel();
            }
          }
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
  }

})();
