(function() {
  'use strict';

  angular
    .module('shared')
    .directive('preloader', [
      '$rootScope',
      'utils',
      function($rootScope, utils) {
        return {
          restrict: 'E',
          scope: {
            width: '=?',
            height: '=?',
            style: '@?'
          },
          template: '<img src="assets/img/spinners/{{style}}{{imgDensity}}.gif" alt="" ng-attr-width="{{width}}" ng-attr-height="{{height}}">',
          link: function(scope, elem, attrs) {

            scope.width = scope.width ? scope.width : 32;
            scope.height = scope.height ? scope.height : 32;
            scope.style = scope.style ? scope.style : 'spinner';
            scope.imgDensity = utils.isHighDensity() ? '@2x' : '';

            attrs.$observe('warning', function() {
              scope.style = 'spinner_warning';
            });

            attrs.$observe('success', function() {
              scope.style = 'spinner_success';
            });

            attrs.$observe('danger', function() {
              scope.style = 'spinner_danger';
            });

            attrs.$observe('small', function() {
              scope.style = 'spinner_small';
            });

            attrs.$observe('medium', function() {
              scope.style = 'spinner_medium';
            });

            attrs.$observe('large', function() {
              scope.style = 'spinner_large';
            });
          }
        };
      }
    ]);
}());
