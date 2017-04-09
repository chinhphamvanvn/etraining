(function() {
  'use strict';

  angular
    .module('shared')
    .directive('onLastRepeat', function($timeout) {
      return function(scope, element, attrs) {
        if (scope.$last) {
          $timeout(function() {
            scope.$emit('onLastRepeat', element, attrs);
          });
        }
      };
    });
}());
