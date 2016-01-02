(function() {
  'use strict';

  angular
    .module('vinarium')
    .directive('match', match);

  /** @ngInject */
  function match($parse) {
    var directive = {
      link: link,
      restrict: 'A',
      require: '?ngModel'
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      if (!ngModel) return;
      if (!attrs['match']) return;

      var parser = $parse(attrs['match']);

      var validator = function (value) {
        var toMatch = parser(scope),
        v = value === toMatch;
        ngModel.$setValidity('match', v);
        return value;
      }

      ngModel.$parsers.push(validator);

      scope.$watch(attrs['match'], function () {
        validator(ngModel.$viewValue);
      });
    }
  }

})();
