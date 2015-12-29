(function() {
  'use strict';

  angular
    .module('vinarium')
    .controller('AuthController', AuthController);

  /** @ngInject */
  function AuthController() {
    var vm = this;

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
