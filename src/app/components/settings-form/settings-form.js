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
  function SettingsFormController(UserRepository, CaveRepository) {
    var vm = this;

    vm.save = save;
    vm.cancel = cancel;

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
  }

})();
