(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('EnumRepository', enumRepository);

  /** @ngInject */
  function enumRepository($q, $firebaseArray, $firebaseObject, FirebaseConfig) {
    var service = {
      apiUrl: FirebaseConfig.api,
      apiPath: '/enums',
      getEnums: getEnums,
      getEnum: getEnum
    };

    return service;

    function getRef() {
      return new Firebase(service.apiUrl + service.apiPath);
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
