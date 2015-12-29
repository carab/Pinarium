(function() {
  'use strict';

  angular
    .module('vinarium')
    .controller('AuthController', AuthController);

  /** @ngInject */
  function AuthController($location, Auth) {
    Auth.$onAuth(function(auth) {
      if (auth) {
        $location.path('/');
      } else {
        activate();
      }
    });

    function activate() {

    }
  }
})();
