/* global Firebase:false */
(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('EnumRepository', enumRepository);

  /** @ngInject */
  function enumRepository($q, $firebaseArray, $firebaseObject, FirebaseConfig) {
    var service = {
      get: get,
      find: find
    };

    return service;

    function getRef() {
      return new Firebase(FirebaseConfig.api + '/enums');
    }

    function get() {
      var ref = getRef();
      return $firebaseObject(ref);
    }

    function find(name) {
      var ref = getRef();
      return $firebaseObject(ref.child(name));
    }
  }
})();
