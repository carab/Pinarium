(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('caveList', {
    	restrict: 'EA',
    	templateUrl: 'app/components/cave-list/cave-list.html',
    	controller: CaveListController
    });

  /** @ngInject */
  function CaveListController() {

  }
})();
