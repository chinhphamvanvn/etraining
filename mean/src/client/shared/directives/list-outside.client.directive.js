(function() {
  'use strict';

  angular
    .module('shared')
    .directive('listOutside', [
      '$window',
      '$timeout',
      function($window, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, elem, attr) {

            var $md_list_outside_wrapper = $(elem),
              w = angular.element($window);

            function md_list_outside_height() {
              var content_height = w.height() - ((48 * 2) + 10);
              $md_list_outside_wrapper.height(content_height);
            }

            md_list_outside_height();

            w.on('resize', function(e) {
              // Reset timeout
              $timeout.cancel(scope.resizingTimer);
              // Add a timeout to not call the resizing function every pixel
              scope.resizingTimer = $timeout(function() {
                md_list_outside_height();
                return scope.$apply();
              }, 280);
            });
          }
        };
      }
    ]);
}());
