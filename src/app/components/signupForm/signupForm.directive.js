(function() {
  'use strict';

  angular
    .module('vinarium')
    .directive('signupForm', signupForm);

  /** @ngInject */
  function signupForm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/signupForm/signupForm.html',
      scope: {},
      controller: signupFormController,
      controllerAs: 'vm',
      bindToController: {}
    };

    return directive;

    /** @ngInject */
    function signupFormController($location, Auth) {
      var vm = this;

      vm.submit = submit;

      function submit(isValid) {
        if (isValid) {
          Auth.$createUser({
            email: vm.user.email,
            password: vm.user.password
          }).then(function(user) {
            Auth.$authWithPassword({
              email: vm.user.email,
              password: vm.user.password
            }).then(function(auth) {
              $location.path('/');
            }).catch(function(error) {
              vm.error = error;
            });
          }).catch(function(error) {
            vm.error = error;
          });
        }
      }
    }
  }

})();
