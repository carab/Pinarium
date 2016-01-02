(function() {
  'use strict';

  angular
    .module('vinarium')
    .directive('uiLanguage', uiLanguage);

  /** @ngInject */
  function uiLanguage() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/uiLanguage/uiLanguage.html',
      scope: {},
      controller: uiLanguageController,
      controllerAs: 'vm',
      bindToController: {
        hideLabel: '='
      }
    };

    return directive;

    /** @ngInject */
    function uiLanguageController($translate, Auth, AvailableLanguages) {
      var vm = this;

      vm.currentLanguage = $translate.use();
      vm.languages = AvailableLanguages;

      vm.switchLanguage = switchLanguage;

      function switchLanguage (language) {
        $translate.use(language);
      }
    }
  }

})();
