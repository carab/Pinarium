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

    function show(options) {
      var deferred = $q.defer();
      
      $translate(['bottle.add', 'bottle.edit']).then(function (translations) {
        var config = {
          ariaLabel: options.id ? translations['bottle.edit'] : translations['bottle.add'],
          controller: BottleFormDialogController,
          controllerAs: 'vm',
          template: '<md-dialog flex flex-gt-sm="75" flex-gt-md="50"><bottle-form id="vm.id" sort="vm.sort" on-save="vm.hide()" on-cancel="vm.cancel()"></bottle-form></md-dialog>',
          parent: angular.element($document.body),
          fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
        }

        if (options.event instanceof MouseEvent) {
          config.targetEvent = options.event;
        }

        $mdDialog.show(config).then(function(data) {
          deferred.resolve(data);
        }, function(data) {
          deferred.reject(data);
        });

        /** @ngInject */
        function BottleFormDialogController($mdDialog) {
          var vm = this;

          vm.id = options.id;
          vm.sort = options.sort;

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
