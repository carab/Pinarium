(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('main', {
    	restrict: 'EA',
      replace: true,
    	templateUrl: 'app/components/main/main.html',
    	controller: MainController,
      $canActivate: canActivate,
      $routeConfig: [{
        path: '/',
        component: 'bottleList',
        name: 'Bottles',
        useAsDefault: true
      }, {
        path: '/caves',
        component: 'caveList',
        name: 'Caves'
      }]
    });

  /** @ngInject */
  function canActivate($router, Auth) {
    var promise = Auth.$requireAuth();

    promise.then(null, function () {
      $router.navigate(['/Auth']);
    });

    return promise;
  }

  /** @ngInject */
  function MainController($router, $mdSidenav, Auth, BottleRepository, CaveRepository) {
    this.$router = $router;
    this.$mdSidenav = $mdSidenav;
    this.Auth = Auth;

    this.bottles = BottleRepository.getBottles();
    this.caves = CaveRepository.getCaves();
  }

  MainController.prototype.closeSidebar = function() {
    this.$mdSidenav('sidebar').close();
  }

  MainController.prototype.navigate = function(route) {
    this.$router.navigate(route);
    this.$mdSidenav('sidebar').close();
  }

})();
