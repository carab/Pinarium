(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('uiLanguage', {
    	restrict: 'EA',
    	templateUrl: 'app/components/ui-language/ui-language.html',
    	controller: UiLanguageController,
      controllerAs: 'vm',
      bindings: {
        hideLabel: '='
      }
    });

  /** @ngInject */
  function UiLanguageController($translate, Auth, AvailableLanguages) {
    var vm = this;

    vm.currentLanguage = $translate.use();
    vm.languages = AvailableLanguages;

    vm.switchLanguage = switchLanguage;

    function switchLanguage (language) {
      $translate.use(language);
    }
  }

})();
