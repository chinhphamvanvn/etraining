(function() {
  'use strict';

  angular
    .module('shared')
    .directive('mdPreloader', [
      function() {
        return {
          restrict: 'E',
          scope: {
            width: '=?',
            height: '=?',
            strokeWidth: '=?',
            style: '@?'
          },
          template: '<div class="md-preloader{{style}}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" ng-attr-height="{{ height }}" ng-attr-width="{{ width }}" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" ng-attr-stroke-width="{{ strokeWidth }}"/></svg></div>',
          link: function(scope, elem, attr) {

            scope.width = scope.width ? scope.width : 48;
            scope.height = scope.height ? scope.height : 48;
            scope.strokeWidth = scope.strokeWidth ? scope.strokeWidth : 4;

            attr.$observe('warning', function() {
              scope.style = ' md-preloader-warning';
            });

            attr.$observe('success', function() {
              scope.style = ' md-preloader-success';
            });

            attr.$observe('danger', function() {
              scope.style = ' md-preloader-danger';
            });

          }
        };
      }
    ]);
}());
