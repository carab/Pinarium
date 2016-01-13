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
    this.$mdSidenav = $mdSidenav;
    this.$state = $state;
    this.Auth = Auth;

    this.bottles = BottleRepository.get();
    this.caves = CaveRepository.getCaves();
  }

  MainController.prototype.closeSidebar = function() {
    this.$mdSidenav('sidebar').close();
  }

  MainController.prototype.go = function(route, params) {
    this.$state.go(route, params);
    this.$mdSidenav('sidebar').close();
  }

})();
