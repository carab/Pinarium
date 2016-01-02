(function() {
  'use strict';

  angular
    .module('vinarium')
    .directive('uiNavbar', uiNavbar);

  /** @ngInject */
  function uiNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/uiNavbar/uiNavbar.html',
      scope: {},
      controller: uiNavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function uiNavbarController($location, $document, $mdDialog, $mdSidenav, $translate, Auth) {
      var vm = this;

      Auth.$onAuth(function(auth) {
        vm.auth = auth;
      });

      vm.signout = signout;
      vm.switchLanguage = switchLanguage;
      vm.toggleSidebar = toggleSidebar;

      function signout() {
        Auth.$unauth();
        $location.path('/auth');
      }

      function switchLanguage(ev) {
        $translate(['user.switchLanguage']).then(function (translations) {
          $mdDialog.show({
            ariaLabel: translations['user.switchLanguage'],
            template: '<md-content layout-padding><ui-language></ui-language></md-content>',
            parent: angular.element($document.body),
            locals: {},
            clickOutsideToClose:true,
            targetEvent: ev
          });
        });
      }

      function toggleSidebar() {
        $mdSidenav('sidebar').toggle();
      }

      function closeSidebar() {
        $mdSidenav('sidebar').close();
      }
    }
  }

})();
