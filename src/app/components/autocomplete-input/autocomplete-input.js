(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('autocompleteInput', {
      restrict: 'EA',
      templateUrl: 'app/components/autocomplete-input/autocomplete-input.html',
      controller: AutocompleteInputController,
      controllerAs: 'vm',
      bindings: {
        model: '=',
        field: '@',
        autocompletes: '=',
        label: '@'
      }
    });

  /** @ngInject */
  function AutocompleteInputController() {
    var vm = this;

    vm.queryAutocompletes = queryAutocompletes;

    function queryAutocompletes() {
      var items = [];
      var search = angular.lowercase(vm.search);

      angular.forEach(vm.autocompletes, function(autocomplete, key) {
        if (angular.lowercase(key).indexOf(search) !== -1) {
          items.push(key);
        }
      });

      return items;
    }
  }

})();
