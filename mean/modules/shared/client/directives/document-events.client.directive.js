(function () {
  'use strict';

  angular
  .module('shared')
    .directive('documentEvents', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    var hidePrimarySidebar = function() {
                        $rootScope.primarySidebarActive = false;
                        $rootScope.primarySidebarOpen = false;
                        $rootScope.hide_content_sidebar = false;
                        $rootScope.primarySidebarHiding = true;
                        $timeout(function() {
                            $rootScope.primarySidebarHiding = false;
                        },280);
                    };

                    var hideSecondarySidebar = function() {
                        $rootScope.secondarySidebarActive = false;
                    };

                    var hideMainSearch = function() {
                        var $header_main = $('#header_main');
                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });
                    };

                    // hide components on $document click
                    scope.onClick = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$($event.target).closest('#sidebar_main').length && !$($event.target).closest('#sSwitch_primary').length && !$rootScope.largeScreen) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( ($rootScope.secondarySidebarActive && !$($event.target).closest('#sidebar_secondary').length && !$($event.target).closest('#sSwitch_secondary').length) && !$rootScope.secondarySidebarPersistent) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && !$($event.target).closest('.header_main_search_form').length && !$($event.target).closest('#main_search_btn').length) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && !$($event.target).closest('#style_switcher').length) {
                            $rootScope.styleSwitcherActive = false;
                        }
                        // sticky notes form
                        if( $rootScope.noteFormActive && !$($event.target).closest('#note_form').length) {
                            $rootScope.noteFormActive = false;
                        }
                    };

                    // hide components on key press (esc)
                    scope.onKeyUp = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$rootScope.largeScreen && $event.keyCode == 27) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( !$rootScope.secondarySidebarPersistent && $rootScope.secondarySidebarActive && $event.keyCode == 27) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && $event.keyCode == 27) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && $event.keyCode == 27) {
                            $rootScope.styleSwitcherActive = false;
                        }
                        // sticky notes form
                        if( $rootScope.noteFormActive && $event.keyCode == 27) {
                            $rootScope.noteFormActive = false;
                        }
                    };

                }
            };
        }
    ]);
}());