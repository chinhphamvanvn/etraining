(function(screenfull) {
  'use strict';

  angular
    .module('shared')
    .directive('fullScreenToggle', [
      function() {
        return {
          restrict: 'A',
          link: function(scope, elem, attrs) {
            $(elem).on('click', function(e) {
              e.preventDefault();
              screenfull.toggle();
              $(window).resize();
            });
          }
        };
      }
    ]);
}(window.screenfull));
