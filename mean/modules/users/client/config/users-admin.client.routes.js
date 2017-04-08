(function() {
  'use strict';

  // Setting up route
  angular
    .module('users.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('admin.workspace.users', {
        abstract: true,
        url: '/users',
        template: '<ui-view/>'
      })
      .state('admin.workspace.users.view', {
        url: '/view/:userId',
        templateUrl: '/modules/users/client/views/view-user.client.view.html',
        controller: 'UserViewController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.users.create', {
        url: '/create',
        templateUrl: '/modules/users/client/views/edit-user.client.view.html',
        controller: 'AdminEditController',
        controllerAs: 'vm',
        resolve: {
          userResolve: newUser
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.users.edit', {
        url: '/edit/:userId',
        templateUrl: '/modules/users/client/views/edit-user.client.view.html',
        controller: 'AdminEditController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.users.list', {
        url: '/list',
        templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      });

    newUser.$inject = ['UsersService'];

    function newUser(UsersService) {
      return new UsersService();
    }

    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {
      return AdminService.get({
        userId: $stateParams.userId
      }).$promise;
    }
  }
}());
