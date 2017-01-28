(function () {
  'use strict';

  angular
  .module('workspace')
    .directive('sidebarPrimary', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                scope: 'true',
                link: function(scope,el,attr) {

                    var $sidebar_main = $('#sidebar_main');

                    scope.submenuToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $($event.currentTarget),
                            slideToogle = $this.next('ul').is(':visible') ? 'slideUp' : 'slideDown';

                        $this.next('ul')
                            .velocity(slideToogle, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    if(slideToogle == 'slideUp') {
                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                    } else {
                                        if($rootScope.menuAccordionMode) {
                                            $this.closest('li').siblings('.submenu_trigger').each(function() {
                                                $(this).children('ul').velocity('slideUp', {
                                                    duration: 500,
                                                    easing: variables.easing_swiftOut,
                                                    begin: function() {
                                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                                    }
                                                })
                                            })
                                        }
                                        $(this).closest('.submenu_trigger').addClass('act_section')
                                    }
                                },
                                complete: function() {
                                    if(slideToogle !== 'slideUp') {
                                        var scrollContainer = $sidebar_main.find(".scroll-content").length ? $sidebar_main.find(".scroll-content") :  $sidebar_main.find(".scrollbar-inner");
                                        $this.closest('.act_section').velocity("scroll", {
                                            duration: 500,
                                            easing: variables.easing_swiftOut,
                                            container: scrollContainer
                                        });
                                    }
                                }
                            });
                    };

                    $rootScope.$watch('slimSidebarActive', function ( status ) {
                        if(status) {
                            var $body = $('body');
                            $sidebar_main
                                .mouseenter(function() {
                                    $body.removeClass('sidebar_slim_inactive');
                                    $body.addClass('sidebar_slim_active');
                                })
                                .mouseleave(function() {
                                    $body.addClass('sidebar_slim_inactive');
                                    $body.removeClass('sidebar_slim_active');
                                })
                       }
                    });

                }
            };
        }
    ]);
}());