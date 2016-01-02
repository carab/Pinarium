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
  function RouterController($router, $mdMedia) {
    var vm = this;

    vm.$mdMedia = $mdMedia;
    
    $router.config([
      { path: '/', component: 'main' },
      { path: '/auth', component: 'auth' }
    ]);
  }

})();
