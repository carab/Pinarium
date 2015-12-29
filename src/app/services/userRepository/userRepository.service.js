(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('UserRepository', userRepository);

  /** @ngInject */
  function userRepository($q, $firebaseArray, $firebaseObject, Auth, FirebaseConfig) {
    var service = {
      getUserRef: getUserRef,
      addUser: addUser
    };

    return service;

    function getAuth() {
        var auth = Auth.$getAuth();

        if (null === auth) {
          throw Error('User should be authenticated');
        }

        return auth;
    }

    function getUserRef() {
      return new Firebase(FirebaseConfig.api + '/users/' + getAuth().uid);
    }

    function getUser() {
      return $firebaseObject(getUserRef());
    }

    function addUser() {
      var user = getUser();
      return user.$save();
    }
  }
})();
