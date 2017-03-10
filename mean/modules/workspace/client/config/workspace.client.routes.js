(function () {
  'use strict';

  // Setting up route
  angular
    .module('workspace.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('workspace', {
        abstract: true,
        url: '/workspace',
        templateUrl: '/modules/workspace/client/views/workspace.client.view.html',
        controller: 'WorkspaceController',
        controllerAs: 'vm',
        resolve: {
            userResolve: getUser
        },
        data: {
          roles: ['user']
        }
      })
      .state('admin.workspace', {
        abstract: true,
        url: '/workspace',
        templateUrl: '/modules/workspace/client/views/workspace.client.view.html',
        controller: 'WorkspaceController',
        controllerAs: 'vm',
        resolve: {
            userResolve: getUser
        },
        data: {
          roles: ['admin']
        }
      });
  }

  
  getUser.$inject = [ 'UsersService'];

  function getUser( UsersService) {
      return UsersService.me().$promise;
  }
}());
