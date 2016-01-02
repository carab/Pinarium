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
      bindToController: {
        hideTitle: '='
      }
    };

    return directive;

    /** @ngInject */
    function signupFormController($location, Auth, UserRepository) {
      var vm = this;

      vm.submit = submit;
      vm.error = 'bouhouh';

      function submit() {
        vm.submitted = true;
        signup(vm.user);
      }

      function signup(user) {
        Auth.$createUser({
          email: user.email,
          password: user.password
        }).then(function() {
          signin(user);
        }).catch(function(error) {
          vm.error = error;
          vm.submitted = false;
        });
      }

      function signin(user) {
        Auth.$authWithPassword({
          email: user.email,
          password: user.password
        }).then(function() {
          UserRepository.addUser();
          $location.path('/');
        }).catch(function(error) {
          vm.error = error;
          vm.submitted = false;
        });
      }
    }
  }

})();
