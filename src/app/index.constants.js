(function() {
  'use strict';

  angular
    .module('vinarium')
    .constant('AvailableLanguages', ['en', 'fr'])
    .constant('Navigation', { current: {}, previous: {} });

})();
