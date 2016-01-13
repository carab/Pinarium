(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('CaveRepository', caveRepository);

  /** @ngInject */
  function caveRepository($q, $firebaseArray, $firebaseObject, UserRepository) {
    var service = {
      getRef: getRef,
      get: get,
      find: find,
      addCave: addCave
    };

    return service;

    function getRef() {
      return UserRepository.getRef().child('caves');
    }

    function get() {
      return $firebaseArray(getRef());
    }

    function find(id) {
      return $firebaseObject(getRef().child(id));
    }

    function addCave(cave) {
      var ref = getRef();

      return $q(function(resolve, reject) {
        ref.push(cave, function(error) {
          if (null === error) {
            resolve();
          } else {
            reject(error);
          }
        });
      });
    }
  }
})();
