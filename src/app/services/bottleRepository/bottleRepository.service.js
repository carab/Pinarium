(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('BottleRepository', bottleRepository);

  /** @ngInject */
  function bottleRepository($q, $firebaseArray, UserRepository) {
    var service = {
      getBottlesRef: getBottlesRef,
      getBottles: getBottles,
      addBottle: addBottle
    };

    return service;

    function getBottlesRef() {
      return UserRepository.getUserRef().child('bottles');
    }

    function getBottles() {
      var ref = getBottlesRef();
      return $firebaseArray(getBottlesRef());
    }

    function addBottle(bottle) {
      var ref = getBottlesRef();

      return $q(function(resolve, reject) {
        ref.push(bottle, function(error) {
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
