(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('BottleRepository', BottleRepository);

  /** @ngInject */
  function BottleRepository($q, $firebaseArray, $firebaseObject, UserRepository, AutocompleteRepository) {
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
      beforeSave: beforeSave,
      afterSave: afterSave
    };

    return service;

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
      return $firebaseArray(getRef());
    }

    function getByCave(cave) {
      var ref = getRef();
      return $firebaseArray(ref.orderByChild('cave').equalTo(cave));
    }

    function find(id) {
      return $firebaseObject(getRef().child(id));
    }

    function save(bottle) {
      beforeSave(bottle);

      var promise = bottle.$save();

      promise.then(function() {
        afterSave(bottle);
      });

      return promise;
    }

    function add(bottle) {
      beforeSave(bottle);

      var promise = $q(function(resolve, reject) {
        getRef().push(bottle, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(bottle);
          }
        });
      });

      promise.then(function(bottle) {
        afterSave(bottle);
      });

      return promise;
    }

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

    function afterSave(bottle) {
      var autocompletedFields = [
        'appellation',
        'cuvee',
        'producer',
        'region',
        'country',
        'capsule',
        ['obtainedFrom', 'people'],
        ['obtainedTo', 'people'],
        'obtainedAt'
      ];

      angular.forEach(autocompletedFields, function(field) {
        var column = field;

        if (angular.isArray(field)) {
            column = field[0];
            field = field[1];
        }

        if (bottle[column]) {
          AutocompleteRepository.add(bottle[column], field);
        }
      });
    }
  }
})();
