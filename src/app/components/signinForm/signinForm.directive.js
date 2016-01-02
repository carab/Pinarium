(function() {
  'use strict';

  angular
    .module('vinarium')
    .directive('signinForm', signinForm);

  /** @ngInject */
  function signinForm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/signinForm/signinForm.html',
      scope: {},
      controller: signinFormController,
      controllerAs: 'vm',
      bindToController: {
        hideTitle: '='
      }
    };

    return directive;

    /** @ngInject */
    function signinFormController($location, $router, Auth) {
      var vm = this;

      vm.submit = submit;

      function submit(isValid) {
        if (isValid) {
          vm.submitted = true;
          signin(vm.user);
        }
      }

      function signin(user) {
        Auth.$authWithPassword({
          email: user.email,
          password: user.password
        }).then(function() {
          $location.path('/');
        }).catch(function(error) {
          vm.error = error;
          vm.submitted = false;
        });
      }
    }
  }

})();
