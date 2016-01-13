(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('main', {
      restrict: 'EA',
      replace: true,
      templateUrl: 'app/components/main/main.html',
      controller: MainController
    });

  /** @ngInject */
  function MainController($mdSidenav, $state, Auth, BottleRepository, CaveRepository) {
    var vm = this;

    vm.$mdSidenav = $mdSidenav;
    vm.$state = $state;
    vm.Auth = Auth;

    activate();

    function activate() {
      vm.caves = CaveRepository.get();
      vm.bottles = BottleRepository.get();
    }
  }

  MainController.prototype.closeSidebar = function() {
    this.$mdSidenav('sidebar').close();
  }

  MainController.prototype.go = function(route, params) {
    this.$state.go(route, params);
    this.$mdSidenav('sidebar').close();
  }

})();
