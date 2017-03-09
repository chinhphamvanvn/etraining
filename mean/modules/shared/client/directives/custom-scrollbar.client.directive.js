(function () {
  'use strict';

  angular
  .module('shared')
    .directive('customScrollbar', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    // check if mini sidebar is enabled
                    if(attrs['id'] == 'sidebar_main' && $rootScope.miniSidebarActive) {
                        return;
                    }

                    $(el)
                        .addClass('uk-height-1-1')
                        .wrapInner("<div class='scrollbar-inner'></div>");

                    if(Modernizr.touch) {
                        $(el).children('.scrollbar-inner').addClass('touchscroll');
                    } else {
                        $timeout(function() {
                            $(el).children('.scrollbar-inner').scrollbar({
                                disableBodyScroll: true,
                                scrollx: false,
                                duration: 100
                            });
                        })
                    }

                }
            }
        }
    ]);
}());