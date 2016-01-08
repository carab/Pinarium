(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('BottleRepository', BottleRepository);

  /** @ngInject */
  function BottleRepository($q, $firebaseArray, $firebaseObject, UserRepository) {
    var service = {
      getRef: getRef,
      get: get,
      getOne: getOne,
      getByCave: getByCave,
      add: add,
      save: save,
      getDefault: getDefault
    };

    return service;

    function getDefault() {
      return {
        quantity: 1,
        quantityDrank: 0
      }
    }

    function getRef() {
      return UserRepository.getRef().child('bottles');
    }

    function get(ref) {
      ref = ref ? ref : getRef();
      return $firebaseArray(getRef());
    }

    function getOne(id) {
      return $firebaseObject(getRef().child(id));
    }

    function getByCave(cave) {
      var ref = getRef();
      return $firebaseArray(ref.orderByChild('cave').equalTo(cave));
    }

    function save(bottle) {
      return bottle.$save();
    }

    function add(bottle) {
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
