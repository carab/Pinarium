(function() {
  'use strict';

  angular
    .module('vinarium')
    .component('signinForm', {
    	restrict: 'EA',
    	templateUrl: 'app/components/signin-form/signin-form.html',
    	controller: SigninFormController,
      controllerAs: 'vm',
      bindToController: {
        hideTitle: '='
      }
    });

  /** @ngInject */
  function SigninFormController($router, Auth, UserRepository) {
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
        $router.navigate(['/Main']);
      }).catch(function(error) {
        vm.error = error;
        vm.submitted = false;
      });
    }
  }

})();
