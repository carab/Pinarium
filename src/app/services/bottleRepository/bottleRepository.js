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
      find: find,
      getByCave: getByCave,
      add: add,
      save: save,
      getDefault: getDefault,
      afterLoad: afterLoad,
      beforeSave: beforeSave
    };

    return service;

    function afterLoad(bottle) {
      if (bottle.addedDate) {
        bottle.addedDate = new Date(bottle.addedDate);
      }

      if (bottle.obtainedDate) {
        bottle.obtainedDate = new Date(bottle.obtainedDate);
      }

      if (bottle.expirationDate) {
        bottle.expirationDate = new Date(bottle.expirationDate);
      }

      if (bottle.bottlingDate) {
        bottle.bottlingDate = new Date(bottle.bottlingDate);
      }
    }

    function beforeSave(bottle) {
      if (bottle.addedDate) {
        bottle.addedDate = bottle.addedDate.getTime();
      }

      if (bottle.obtainedDate) {
        bottle.obtainedDate = bottle.obtainedDate.getTime();
      }

      if (bottle.expirationDate) {
        bottle.expirationDate = bottle.expirationDate.getTime();
      }

      if (bottle.bottlingDate) {
        bottle.bottlingDate = bottle.bottlingDate.getTime();
      }
    }

    function getDefault(defaults) {
      if (angular.isUndefined(defaults)) {
        defaults = {};
      }

      return angular.extend({
        quantity: 1,
        quantityDrank: 0,
        sort: 'wine',
        addedDate: (new Date()).getTime()
      }, defaults);
    }

    function getRef() {
      return UserRepository.getRef().child('bottles');
    }

    function get(ref) {
      ref = ref ? ref : getRef();
      var bottles = $firebaseArray(getRef());

      bottles.$loaded(function () {
        angular.forEach(bottles, function (bottle) {
          angular.extend(bottle, getDefault(bottle));
          bottles.$save(bottle); // how to save only if .extend() changed something ?
        });
      });

      return bottles;
    }

    function find(id) {
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
