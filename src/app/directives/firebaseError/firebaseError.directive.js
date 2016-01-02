(function() {
  'use strict';

  angular
    .module('vinarium')
    .directive('firebaseError', firebaseError);

  /** @ngInject */
  function firebaseError($parse) {
    var directive = {
      link: link,
      restrict: 'A',
      require: '?ngModel'
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      if (!ngModel) return;
      if (!attrs['firebaseError']) return;

      var parser = $parse(attrs['firebaseError']),
          locked = false;

      var validator = function (value) {
        if (locked) return value;

        var error = parser(scope),
            v = (angular.isUndefined(error)
              || angular.isUndefined(error.code)
              || attrs['firebaseCodes'] !== error.code);

        ngModel.$setValidity('firebaseError', v);
        return value;
      }

      ngModel.$parsers.push(validator);

      scope.$watch(attrs['firebaseError'], function () {
        locked = false;
        validator(ngModel.$viewValue);
      });

      element.on('keydown change', function() {
        locked = true;
        return ngModel.$setValidity('firebaseError', true);
      });
    }
  }

})();
