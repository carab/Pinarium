(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('CaveRepository', caveRepository);

  /** @ngInject */
  function caveRepository($q, $firebaseArray, $firebaseObject, UserRepository) {
    var service = {
      getCavesRef: getCavesRef,
      getCaves: getCaves,
      getCave: getCave,
      addCave: addCave
    };

    return service;

    function getCavesRef() {
      return UserRepository.getRef().child('caves');
    }

    function getCaves() {
      return $firebaseArray(getCavesRef());
    }

    function getCave(id) {
      return $firebaseObject(getCavesRef().child(id));
    }

    function addCave(cave) {
      var ref = getCavesRef();

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
