(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('uiNavbar', {
      restrict: 'EA',
      templateUrl: 'app/components/ui-navbar/ui-navbar.html',
      controller: UiNavbarController,
      controllerAs: 'vm'
    });

    /** @ngInject */
  function UiNavbarController($document, $mdDialog, $mdSidenav, $state, $translate, Auth) {
    var vm = this;

    Auth.$onAuth(function(auth) {
      vm.auth = auth;
    });

    vm.signout = signout;
    vm.switchLanguage = switchLanguage;
    vm.toggleSidebar = toggleSidebar;
    vm.go = go;

    function signout() {
      Auth.$unauth();
      $state.go('auth');
    }

    function go(name, params) {
      $state.go(name, params);
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
  }

})();
