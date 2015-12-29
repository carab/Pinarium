(function() {
  'use strict';

  angular
    .module('vinarium')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($location, Auth) {
    var vm = this;

    Auth.$onAuth(function(auth) {
      if (auth) {
        activate();
      } else {
        $location.path('/auth');
      }
    });

    function activate() {

    }
  }
})();
