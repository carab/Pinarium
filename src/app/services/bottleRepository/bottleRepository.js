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
      addDefaults: addDefaults,
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

    function addDefaults(bottle) {
      var deferred = $q,
          defaults = {
            quantity: 1,
            quantityDrank: 0,
            sort: 'wine',
            addedDate: (new Date()).getTime()
          };

      // Those 2 lines are to preserve the bottle object and
      // its values, as .extend() override properties
      angular.extend(defaults, bottle);
      angular.extend(bottle, defaults);

      UserRepository.getSettings().$loaded(function (settings) {
        bottle.cave = settings.defaultCave;
      });

      return deferred.promise;
    }

    function getDefault(bottle) {
      addDefaults(bottle);
      afterLoad(bottle);

      return bottle;
    }

    function getRef() {
      return UserRepository.getRef().child('bottles');
    }

    function get(ref) {
      ref = ref ? ref : getRef();
      var bottles = $firebaseArray(getRef());

      bottles.$loaded(function () {
        angular.forEach(bottles, function (bottle) {
          addDefaults(bottle);
          bottles.$save(bottle); // how to save only if .extend() changed something ?
        });
      });

      return bottles;
    }

    function getByCave(cave) {
      var ref = getRef();
      return $firebaseArray(ref.orderByChild('cave').equalTo(cave));
    }

    function find(id) {
      var bottle = $firebaseObject(getRef().child(id));
      
      bottle.$loaded(function () {
        afterLoad(bottle);
      });

      return bottle;
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
