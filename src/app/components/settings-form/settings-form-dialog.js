(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('SettingsFormDialog', SettingsFormDialog);

  /** @ngInject */
  function SettingsFormDialog($q, $document, $mdDialog, $mdMedia, $translate) {
    return {
      show: show,
      close: close
    };

    function show(options) {
      var deferred = $q.defer();

      $translate(['settings.edit']).then(function (translations) {
        var config = {
          ariaLabel: translations['settings.edit'],
          controller: SettingsFormDialogController,
          controllerAs: 'vm',
          template: '<md-dialog flex flex-gt-sm="75" flex-gt-md="50"><settings-form on-save="vm.hide()" on-cancel="vm.cancel()"></settings-form></md-dialog>',
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
        function SettingsFormDialogController($mdDialog) {
          var vm = this;

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
