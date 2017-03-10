(function () {
  'use strict';

  angular
  .module('shared')
    .directive('hierarchicalSlide', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $this = $(elem),
                        baseDelay = 100;

                    var add_animation = function(children,context,childrenLength) {
                        children.each(function(index) {
                            $(this).css({
                                '-webkit-animation-delay': (index * baseDelay) + "ms",
                                'animation-delay': (index * baseDelay) + "ms"
                            })
                        });
                        $this.waypoint({
                            handler: function() {
                                $this.addClass('hierarchical_slide_inView');
                                $timeout(function() {
                                    $this.removeClass('hierarchical_slide hierarchical_slide_inView');
                                    children.css({
                                        '-webkit-animation-delay': '',
                                        'animation-delay': ''
                                    });
                                }, (childrenLength*baseDelay)+1200 );
                                this.destroy();
                            },
                            context: context[0],
                            offset: '90%'
                        });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                        if($rootScope.pageLoaded) {
                            var thisChildren = attrs['slideChildren'] ? $this.children(attrs['slideChildren']) : $this.children(),
                                thisContext = attrs['slideContext'] ? $this.closest(attrs['slideContext']) : 'window',
                                thisChildrenLength = thisChildren.length;

                            if(thisChildrenLength >= 1) {
                                $timeout(function() {
                                    add_animation(thisChildren,thisContext,thisChildrenLength)
                                },560)
                            }
                        }
                    });

                }
            }
        }
    ]);
}());