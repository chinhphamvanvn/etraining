(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('workspace.users', {
          abstract: true,
          url: '/users',
          template: '<ui-view/>',
      })
      .state('workspace.users.view', {
        url: '/view',
        templateUrl: '/modules/users/client/views/view-user.client.view.html',
        controller: 'UserViewController',
        controllerAs: 'vm',
        resolve: {
            userResolve: getUser
        },
        data : {
            roles:['admin','user']
        }
      })
      .state('workspace.users.edit', {
        url: '/edit',
        templateUrl: '/modules/users/client/views/edit-user.client.view.html',
        controller: 'UserEditController',
        controllerAs: 'vm',
        resolve: {
            userResolve: getUser
        },
        data : {
            roles:['admin','user']
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        template: '<ui-view/>'
      })
      .state('authentication.signin', {
        url: '/signin',
        templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        data: {
            action: 'login',
        },
        controllerAs: 'vm'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
            action: 'register'
        },
      });
    
    getUser.$inject = ['$stateParams', 'AdminService', 'Authentication'];

    function getUser($stateParams, AdminService, Authentication) {
          return Authentication.user;
    }
  }
}());
