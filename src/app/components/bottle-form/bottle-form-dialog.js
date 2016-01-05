(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('BottleFormDialog', BottleFormDialog);

  /** @ngInject */
  function BottleFormDialog($q, $document, $mdDialog, $mdMedia, $translate) {
    return {
      show: show,
      close: close
    };

    function show(event, id) {
      var deferred = $q.defer();

      $translate(['bottle.add']).then(function (translations) {
        var config = {
          ariaLabel: translations['bottle.add'],
          controller: BottleFormDialogController,
          controllerAs: 'vm',
          template: '<bottle-form layout="column" layout-fill id="vm.id" on-save="vm.hide()" on-cancel="vm.cancel()"></bottle-form>',
          parent: angular.element($document.body),
          fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
        }

        if (event instanceof MouseEvent) {
          config.targetEvent = event;
        }

        $mdDialog.show(config).then(function(data) {
          deferred.resolve(data);
        }, function(data) {
          deferred.reject(data);
        });

        /** @ngInject */
        function BottleFormDialogController($mdDialog) {
          var vm = this;

          vm.id = id;

          vm.hide = hide;
          vm.cancel = cancel;

          function hide() {
            $mdDialog.hide();
          }

          function cancel() {
            $mdDialog.cancel();
          }
        }
      });

      return deferred.promise;
    }

    function close() {
      $mdDialog.cancel();
    }
  }
})();
