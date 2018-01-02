(function(Prism) {
  'use strict';
  angular
    .module('shared.prism')
    .directive('prismHighlight', ['$timeout', function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          element.ready(function() {
            $timeout(function() {
              Prism.highlightElement(element[0]);
            });
          });
        }
      };
    }]);
}(window.Prism));
