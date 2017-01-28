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
        data: {
          roles: ['admin']
        }
      });
  }
}());
