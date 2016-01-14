/* global Firebase:false */
(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('UserRepository', userRepository);

  /** @ngInject */
  function userRepository($q, $firebaseArray, $firebaseObject, Auth, FirebaseConfig) {
    var service = {
      getRef: getRef,
      addUser: addUser,
      getSettings: getSettings,
      saveSettings: saveSettings
    };

    return service;

    function getAuth() {
        var auth = Auth.$getAuth();

        if (null === auth) {
          throw Error('User should be authenticated');
        }

        return auth;
    }

    function getRef(id) {
      id = id ? id : getAuth().uid;
      return new Firebase(FirebaseConfig.api + '/users/' + id);
    }

    function getUser() {
      return $firebaseObject(getRef());
    }

    function getSettings() {
      return $firebaseObject(getRef().child('/settings'));
    }

    function saveSettings(settings) {
      return settings.$save();
    }

    function addUser() {
      var user = getUser();
      return user.$save();
    }
  }
})();
