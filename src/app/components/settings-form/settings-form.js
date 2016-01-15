(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('settingsForm', {
      restrict: 'EA',
      templateUrl: 'app/components/settings-form/settings-form.html',
      controller: SettingsFormController,
      controllerAs: 'vm',
      bindings: {
        onSave: '&',
        onCancel: '&'
      }
    });

  /** @ngInject */
  function SettingsFormController(UserRepository, CaveRepository, BottleRepository, AutocompleteRepository) {
    var vm = this;

    vm.save = save;
    vm.cancel = cancel;

    vm.processBottles = processBottles;

    activate();

    function activate() {
      vm.settings = UserRepository.getSettings();
      vm.caves = CaveRepository.get();
    }

    function save() {
      UserRepository.saveSettings(vm.settings).then(function() {
        vm.onSave();
      });
    }

    function cancel() {
      vm.onCancel();
    }

    function processBottles() {
      AutocompleteRepository.remove().then(function() {
        BottleRepository.get().$loaded().then(function(bottles) {
          angular.forEach(bottles, function(bottle) {
            BottleRepository.afterSave(bottle);
          });
        });
      });
    }
  }

})();
