(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('signinForm', {
    	restrict: 'EA',
    	templateUrl: 'app/components/signin-form/signin-form.html',
    	controller: SigninFormController,
      controllerAs: 'vm',
      bindings: {
        hideTitle: '='
      }
    });

  /** @ngInject */
  function SigninFormController($state, Auth, UserRepository) {
    var vm = this;

    vm.submit = submit;

    function submit() {
      vm.submitted = true;
      signin(vm.user);
    }

    function signin(user) {
      Auth.$authWithPassword({
        email: user.email,
        password: user.password
      }).then(function() {
        $state.go('app.bottles');
      }).catch(function(error) {
        vm.error = error;
        vm.submitted = false;
      });
    }
  }

})();
