(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('auth', {
    	restrict: 'EA',
    	templateUrl: 'app/components/auth/auth.html',
    	controller: AuthController
    });

  /** @ngInject */
  function AuthController() {

  }
  
})();
