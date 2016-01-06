(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('BottleRepository', bottleRepository);

  /** @ngInject */
  function bottleRepository($q, $firebaseArray, $firebaseObject, UserRepository) {
    var service = {
      getRef: getRef,
      get: get,
      getBottles: getBottles,
      getBottle: getBottle,
      getByCave: getByCave,
      addBottle: addBottle
    };

    return service;

    function getRef() {
      return UserRepository.getUserRef().child('bottles');
    }

    function get(ref) {
      ref = ref ? ref : getRef();
      console.log(ref);
      return $firebaseArray(getRef());
    }

    function getBottles() {
      return $firebaseArray(getRef());
    }

    function getBottle(id) {
      return $firebaseObject(getRef().child(id));
    }

    function getByCave(cave) {
      var ref = getRef();
      return $firebaseArray(ref.orderByChild('cave').equalTo(cave));
    }

    function addBottle(bottle) {
      var ref = getRef();

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
