(function () {
  'use strict';

  angular
  .module('shared')
  .filter('reverseOrder', function() {
      return function(items) {
          return items.slice().reverse();
      };
  });
}());