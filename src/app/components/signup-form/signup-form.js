(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('signupForm', {
    	restrict: 'EA',
    	templateUrl: 'app/components/signup-form/signup-form.html',
    	controller: SignupFormController,
      controllerAs: 'vm',
      bindings: {
        hideTitle: '='
      }
    });

  /** @ngInject */
  function SignupFormController($location, Auth, UserRepository) {
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

})();
