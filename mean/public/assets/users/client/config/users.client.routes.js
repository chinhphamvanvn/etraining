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
            roles:['user']
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
            roles:['user']
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
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: '/modules/users/client/views/reset-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password reset form'
        }
      });;
    
    getUser.$inject = ['$stateParams', 'UsersService'];

    function getUser($stateParams, UsersService) {
          return UsersService.me().$promise;
    }
  }
}());
