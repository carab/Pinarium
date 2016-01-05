(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('BottleRepository', bottleRepository);

  /** @ngInject */
  function bottleRepository($q, $firebaseArray, $firebaseObject, UserRepository) {
    var service = {
      getBottlesRef: getBottlesRef,
      getBottles: getBottles,
      getBottle: getBottle,
      getByCave: getByCave,
      addBottle: addBottle
    };

    return service;

    function getBottlesRef() {
      return UserRepository.getUserRef().child('bottles');
    }

    function getBottles() {
      return $firebaseArray(getBottlesRef());
    }

    function getBottle(id) {
      return $firebaseObject(getBottlesRef().child(id));
    }

    function getByCave(cave) {
      var ref = getBottlesRef();
      return $firebaseArray(ref.orderByChild('cave').equalTo(cave));
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
