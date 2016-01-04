(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('CaveRepository', caveRepository);

  /** @ngInject */
  function caveRepository($q, $firebaseArray, UserRepository) {
    var service = {
      getCavesRef: getCavesRef,
      getCaves: getCaves,
      addCave: addCave
    };

    return service;

    function getCavesRef() {
      return UserRepository.getUserRef().child('caves');
    }

    function getCaves() {
      return $firebaseArray(getCavesRef());
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
