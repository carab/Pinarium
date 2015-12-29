(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('Auth', Auth);

  /** @ngInject */
  function Auth($firebaseAuth, FirebaseConfig) {
    var ref = new Firebase(FirebaseConfig.api);
    return $firebaseAuth(ref);
  }
})();
