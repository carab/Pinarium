(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('app', {
    	restrict: 'EA',
    	templateUrl: 'app/components/app/app.html',
    	controller: AppController
    });

  /** @ngInject */
  function AppController($mdMedia, $router) {
    this.$mdMedia = $mdMedia;

    $router.config([{
      path: '/',
      component: 'auth',
      name: 'Auth'
    }, {
      path: '/app/...',
      component: 'main',
      name: 'Main'
    }]);
  }

})();
