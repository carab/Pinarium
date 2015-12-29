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
    function uiNavbarController($location, Auth) {
      var vm = this;

      Auth.$onAuth(function(auth) {
        vm.auth = auth;
      });

      vm.signout = signout;

      function signout() {
        Auth.$unauth();
        $location.path('/auth');
      }
    }
  }

})();
