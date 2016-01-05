(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('CaveFormDialog', CaveFormDialog);

  /** @ngInject */
  function CaveFormDialog($q, $document, $mdDialog, $mdMedia, $translate) {
    return {
      show: show,
      close: close
    };

    function show(event, id) {
      var deferred = $q.defer();

      $translate(['cave.add', 'cave.edit']).then(function (translations) {
        var config = {
          ariaLabel: id ? translations['cave.edit'] : translations['cave.add'],
          controller: CaveFormDialogController,
          controllerAs: 'vm',
          template: '<cave-form layout="column" layout-fill id="vm.id" on-save="vm.hide()" on-cancel="vm.cancel()"></cave-form>',
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
        function CaveFormDialogController($mdDialog) {
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
