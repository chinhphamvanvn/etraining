(function() {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function($injector, $location) {
      $injector.get('$state').transitionTo('error.not-found', null, {
        location: false
      });
    });

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/src/client/core/views/home.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('search', {
        url: '/search?keyword',
        templateUrl: '/src/client/core/views/home.client.view.html',
        controller: 'HomeSearchController',
        controllerAs: 'vm'
      })
      .state('error', {
        abstract: true,
        url: '/error',
        template: '<ui-view/>'
      })
      .state('error.not-found', {
        url: '/not-found',
        templateUrl: '/src/client/core/views/404.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true
        }
      })
      .state('error.bad-request', {
        url: '/bad-request',
        templateUrl: '/src/client/core/views/400.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true
        }
      })
      .state('error.forbidden', {
        url: '/forbidden',
        templateUrl: '/src/client/core/views/403.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('error.server-error', {
        url: '/server-error',
        templateUrl: '/src/client/core/views/500.client.view.html',
        data: {
          ignoreState: true
        }
      });
  }
}());
