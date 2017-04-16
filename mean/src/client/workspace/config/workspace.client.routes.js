(function() {
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
        templateUrl: '/src/client/workspace/views/workspace.client.view.html',
        controller: 'WorkspaceController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser,
          permissionViewResolve: getMenuPermission
        },
        data: {
          roles: ['user']
        }
      })
      .state('admin.workspace', {
        abstract: true,
        url: '/workspace',
        templateUrl: '/src/client/workspace/views/workspace.client.view.html',
        controller: 'WorkspaceController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser,
          permissionViewResolve: getMenuPermission
        },
        data: {
          roles: ['admin']
        }
      });
  }


  getUser.$inject = ['UsersService'];

  function getUser(UsersService) {
    return UsersService.me().$promise;
  }
  
  getMenuPermission.$inject = ['Authentication', 'PermissionViewsService'];

  function getMenuPermission(Authentication, PermissionViewsService) {
    var user = Authentication.user;
    if (user.permissionView)
      return PermissionViewsService.get({permissionviewId:user.permissionView}).$promise;
    else
      return null;
  }
}());
