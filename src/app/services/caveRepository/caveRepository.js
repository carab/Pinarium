(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('CaveRepository', caveRepository);

  /** @ngInject */
  function caveRepository($q, $firebaseArray, $firebaseObject, $translate, UserRepository) {
    var service = {
      getRef: getRef,
      get: get,
      find: find,
      addCave: addCave,
      addDefaults: addDefaults,
      getDefault: getDefault
    };

    function addDefaults(cave) {
      var defaults = {};

      // Those 2 lines are to preserve the cave object and
      // its values, as .extend() override properties
      angular.extend(defaults, cave);
      angular.extend(cave, defaults);

      var translatePromise = $translate(['cave.name.default']).then(function (translations) {
        cave.name = translations['cave.name.default'];
      });

      return $q.all([translatePromise]);
    }

    function getDefault(cave) {
      cave = cave ? cave : {};

      return $q(function(resolve, reject) {
        addDefaults(cave).then(function() {
          resolve(cave);
        }).catch(function (err) {
          reject(err);
        });
      });
    }

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
      return $q(function(resolve, reject) {
        var ref = getRef().push(cave, function(err) {
          if (null === err) {
            $firebaseObject(ref).$loaded().then(function(cave) {
              resolve(cave);
            }).catch(function(err) {
              reject(err);
            });
          } else {
            reject(err);
          }
        });
      });
    }
  }
})();
