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
  function SignupFormController($state, Auth, UserRepository, CaveRepository) {
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
      return Auth.$authWithPassword({
        email: user.email,
        password: user.password
      }).then(function() {
        UserRepository.addUser().then(function() {
          // Create default cave and add it to the settings if no cave set
          UserRepository.getSettings().$loaded().then(function(settings) {
            if (angular.isUndefined(settings.defaultCave)) {
              CaveRepository.getDefault().then(function(cave) {
                CaveRepository.addCave(cave).then(function(cave) {
                  settings.defaultCave = cave.$id;
                  UserRepository.saveSettings(settings).finally(goDashboard);
                }).catch(goDashboard);
              }).catch(goDashboard);
            } else {
              goDashboard();
            }
          }).catch(goDashboard);
        }).catch(goDashboard);
      }).catch(function(err) {
        vm.error = err;
        vm.submitted = false;
      });
    }

    function goDashboard() {
      $state.go('app.caves');
    }
  }

})();
