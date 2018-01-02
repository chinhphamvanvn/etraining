(function() {
  'use strict';

  angular
    .module('shared')
    .filter('initials', function() {
      return function(x) {
        if (x) {
          return x.split(' ').map(function(s) {
            return s.charAt(0);
          }).join('');
        } else {
          return null;
        }
      };
    });

}());
