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
  function AppController($mdMedia) {
    this.$mdMedia = $mdMedia;
  }

})();
