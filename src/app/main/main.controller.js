(function() {
  'use strict';

  angular
    .module('vinarium')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($location, $mdSidenav, Auth) {
    var vm = this;

    vm.closeSidebar = closeSidebar;

    Auth.$onAuth(function(auth) {
      if (auth) {
        activate();
      } else {
        $location.path('/auth');
      }
    });

    function activate() {

    }

    function closeSidebar() {
      $mdSidenav('sidebar').close();
    }
  }
})();
