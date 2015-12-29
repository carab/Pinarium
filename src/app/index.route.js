(function() {
  'use strict';

  angular
    .module('vinarium')
    .config(routerConfig)
    .controller('RouterController', RouterController);

  /** @ngInject */
  function routerConfig($componentLoaderProvider) {
    $componentLoaderProvider.setTemplateMapping(function(name) {
      return 'app/' + name + '/' + name + '.html';
    });
  }

  /** @ngInject */
  function RouterController($router, $scope, $mdMedia) {
    $scope.$mdMedia = $mdMedia;
    $router.config([
      { path: '/', component: 'main', as: 'main' },
      { path: '/auth', component: 'auth', as: 'auth' }
    ]);
  }

})();
