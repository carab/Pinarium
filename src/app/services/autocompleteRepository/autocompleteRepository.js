(function() {
  'use strict';

  angular
    .module('vinarium')
    .factory('AutocompleteRepository', AutocompleteRepository);

  /** @ngInject */
  function AutocompleteRepository($q, $firebaseArray, $firebaseObject, UserRepository) {
    var service = {
      get: get,
      find: find,
      add: add,
      remove: remove
    };

    return service;

    function getRef() {
      return UserRepository.getRef().child('autocompletes');
    }

    function get() {
      return $firebaseObject(getRef());
    }

    function find(field) {
      return $firebaseObject(getRef().child(field));
    }

    function add(value, field) {
      if (value && field) {
        var ref = getRef().child(field).child(value);
        ref.set(true);
      }
    }

    function remove() {
      return $q(function(resolve, reject) {
        getRef().remove(function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }
})();
