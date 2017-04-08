(function() {
  'use strict';

  angular
    .module('core')
    .run(routeFilter);

  routeFilter.$inject = ['$rootScope', '$state', 'Authentication', '$stateParams', '$http', '$window', '$timeout', 'variables', '_'];

  function routeFilter($rootScope, $state, Authentication, $stateParams, $http, $window, $timeout, variables, _) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeStart(event, toState, toParams, fromState, fromParams) {

      // main search
      $rootScope.mainSearchActive = false;
      // secondary sidebar
      $rootScope.sidebar_secondary = false;
      $rootScope.secondarySidebarHiddenLarge = false;
      if ($($window).width() < 1220) {
        // hide primary sidebar
        $rootScope.primarySidebarActive = false;
        $rootScope.hide_content_sidebar = false;
      }
      if (!toParams.hasOwnProperty('hidePreloader')) {
        $rootScope.pageLoading = true;
        $rootScope.pageLoaded = false;
      }

      // Check authentication before changing state
      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        var allowed = false;

        for (var i = 0, roles = toState.data.roles; i < roles.length; i++) {
          if ((roles[i] === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(roles[i]) !== -1)) {
            allowed = true;
            break;
          }
        }

        if (!allowed) {
          event.preventDefault();
          if (Authentication.user !== null && typeof Authentication.user === 'object') {
            // $state.transitionTo('authentication.signin');
            $state.go('authentication.signin');
          } else {
            $state.go('authentication.signin').then(function() {
              //  Record previous state
              storePreviousState(toState, toParams);
            });
          }
        }
      }
    }

    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      // Record previous state
      $('html, body').animate({
        scrollTop: 0
      }, 200);
      $rootScope.state = toState;
      if (toState.data && _.contains(toState.data.roles, 'admin'))
        $rootScope.viewerRole = 'admin';
      else
        $rootScope.viewerRole = 'user';

      if (detectIE()) {
        $('svg,canvas,video').each(function() {
          $(this).css('height', 0);
        });
      }

      $timeout(function() {
        $rootScope.pageLoading = false;
      }, 300);

      $timeout(function() {
        $rootScope.pageLoaded = true;
        $rootScope.appInitialized = true;
        // wave effects
        $window.Waves.attach('.md-btn-wave,.md-fab-wave', ['waves-button']);
        $window.Waves.attach('.md-btn-wave-light,.md-fab-wave-light', ['waves-button', 'waves-light']);
        if (detectIE()) {
          $('svg,canvas,video').each(function() {
            var $this = $(this),
              height = $(this).attr('height'),
              width = $(this).attr('width');
            if (height) {
              $this.css('height', height);
            }
            if (width) {
              $this.css('width', width);
            }
            var peity = $this.prev('.peity_data,.peity');
            if (peity.length) {
              peity.peity().change();
            }
          });
        }
      }, 600);
      storePreviousState(fromState, fromParams);
    }

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
    }

    function detectIE() {
      var a = window.navigator.userAgent,
        b = a.indexOf('MSIE ');
      if (b > 0)
        return parseInt(a.substring(b + 5, a.indexOf('.', b)), 10);
      if (a.indexOf('Trident/') > 0)
        return parseInt(a.substring(b + 3, a.indexOf('.', b)), 10);
      b = a.indexOf('Edge/');
      return b > 0 ? parseInt(a.substring(b + 5, a.indexOf('.', b)), 10) : !1;
    }
  }
}());
