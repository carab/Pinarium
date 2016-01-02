/* global moment:false */
(function() {
  'use strict';

  angular
    .module('vinarium')
    .constant('moment', moment)
    .constant('AvailableLanguages', ['en', 'fr']);

})();
