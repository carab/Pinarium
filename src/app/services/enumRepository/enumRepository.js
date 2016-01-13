/* global Firebase:false */
(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('EnumRepository', enumRepository);

  /** @ngInject */
  function enumRepository($q, $firebaseArray, $firebaseObject, FirebaseConfig) {
    var service = {
      getEnums: getEnums,
      getEnum: getEnum
    };

    return service;

    function getRef() {
      return new Firebase(FirebaseConfig.api + '/enums');
    }

    function getEnums() {
      var ref = getRef();
      return $firebaseObject(ref);
    }

    function getEnum(name) {
      var ref = getRef();
      return $firebaseObject(ref.child(name));
    }
  }
})();
