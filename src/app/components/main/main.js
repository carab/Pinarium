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
  function canActivate(Auth) {
    var promise = Auth.$requireAuth();

    promise.then(null, function () {
      //
    });

    return promise;
  }

  /** @ngInject */
  function MainController($mdSidenav, $state, Auth, BottleRepository, CaveRepository) {
    this.$mdSidenav = $mdSidenav;
    this.$state = $state;
    this.Auth = Auth;

    this.bottles = BottleRepository.getBottles();
    this.caves = CaveRepository.getCaves();
  }

  MainController.prototype.closeSidebar = function() {
    this.$mdSidenav('sidebar').close();
  }

  MainController.prototype.go = function(route) {
    this.$state.go(route);
    this.$mdSidenav('sidebar').close();
  }

})();
