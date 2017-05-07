(function() {
  'use strict';

  angular
    .module('shared')
    .filter('html2text', [ function() {
      return function(text) {
        return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
      };
    }]);
}());
