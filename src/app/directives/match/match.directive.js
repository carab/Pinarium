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

    function link(scope, elem, attrs, ctrl) {
      if (!ctrl) return;
      if (!attrs['match']) return;

      var firstPassword = $parse(attrs['match']);

      var validator = function (value) {
        var temp = firstPassword(scope),
        v = value === temp;
        ctrl.$setValidity('match', v);
        return value;
      }

      ctrl.$parsers.unshift(validator);
      ctrl.$formatters.push(validator);
      attrs.$observe('match', function () {
        validator(ctrl.$viewValue);
      });
    }
  }

})();
