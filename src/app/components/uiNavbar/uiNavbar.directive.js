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
        console.log('test');
        vm.auth = auth;
        console.log(auth);
      });

      vm.signout = signout;

      function signout() {
        console.log('1')
        Auth.$unauth();
        console.log('2')
        $location.path('/auth');
        console.log('3')
      }
    }
  }

})();
