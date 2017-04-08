(function() {
  'use strict';

  angular
    .module('shared')
    .directive('hierarchicalShow', [
      '$timeout',
      '$rootScope',
      function($timeout, $rootScope) {
        return {
          restrict: 'A',
          scope: true,
          link: function(scope, elem, attrs) {

            var parent_el = $(elem),
              baseDelay = 60;

            var add_animation = function(children, length) {
              children
                .each(function(index) {
                  $(this).css({
                    '-webkit-animation-delay': (index * baseDelay) + 'ms',
                    'animation-delay': (index * baseDelay) + 'ms'
                  });
                })
                .end()
                .waypoint({
                  element: elem[0],
                  handler: function() {
                    parent_el.addClass('hierarchical_show_inView');
                    setTimeout(function() {
                      parent_el
                        .removeClass('hierarchical_show hierarchical_show_inView fast_animation')
                        .children()
                        .css({
                          '-webkit-animation-delay': '',
                          'animation-delay': ''
                        });
                    }, (length * baseDelay) + 1200);
                    this.destroy();
                  },
                  context: window,
                  offset: '90%'
                });
            };

            $rootScope.$watch('pageLoaded', function() {
              if ($rootScope.pageLoaded) {
                var children = parent_el.children(),
                  children_length = children.length;

                $timeout(function() {
                  add_animation(children, children_length);
                }, 560);
              }
            });
          }
        };
      }
    ]);
}());
