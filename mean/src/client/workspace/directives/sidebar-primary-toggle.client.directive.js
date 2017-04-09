(function() {
  'use strict';

  angular
    .module('workspace')
    .directive('sidebarPrimaryToggle', [
      '$rootScope',
      '$window',
      '$timeout',
      function($rootScope, $window, $timeout) {
        return {
          restrict: 'E',
          replace: true,
          scope: true,
          template: '<a id="sSwitch_primary" href="#" class="sSwitch sSwitch_left" ng-click="togglePrimarySidebar($event)" ng-hide="miniSidebarActive || slimSidebarActive || topMenuActive"><span class="sSwitchIcon"></span></a>',
          link: function(scope, el, attrs) {
            scope.togglePrimarySidebar = function($event) {

              $event.preventDefault();

              if ($rootScope.primarySidebarActive) {
                $rootScope.primarySidebarHiding = true;
                if ($rootScope.largeScreen) {
                  $timeout(function() {
                    $rootScope.primarySidebarHiding = false;
                    $(window).resize();
                  }, 290);
                }
              } else {
                if ($rootScope.largeScreen) {
                  $timeout(function() {
                    $(window).resize();
                  }, 290);
                }
              }

              $rootScope.primarySidebarActive = !$rootScope.primarySidebarActive;

              if (!$rootScope.largeScreen) {
                $rootScope.hide_content_sidebar = $rootScope.primarySidebarActive;
              }

              if ($rootScope.primarySidebarOpen) {
                $rootScope.primarySidebarOpen = false;
                $rootScope.primarySidebarActive = false;
              }
            };

          }
        };
      }
    ]);
}());
