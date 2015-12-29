(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('BottleRepository', bottleRepository);

  /** @ngInject */
  function bottleRepository($q, $firebaseArray, FirebaseConfig) {
    var service = {
      apiUrl: FirebaseConfig.api,
      apiPath: '/bottles',
      getBottles: getBottles,
      addBottle: addBottle
    };

    return service;

    function getRef() {
      return new Firebase(service.apiUrl + service.apiPath);
    }

    function getBottles() {
      var ref = getRef();
      return $firebaseArray(ref);
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
