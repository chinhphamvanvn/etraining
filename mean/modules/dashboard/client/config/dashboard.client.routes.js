(function () {
  'use strict';

  // Setting up route
  angular
    .module('dashboard.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('workspace.dashboard', {
        url: '/dashboard',
        templateUrl: '/modules/dashboard/client/views/dashboard.client.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
        data: {
          roles: [ 'user']
        }
      })
      .state('admin.workspace.dashboard', {
        url: '/dashboard',
        templateUrl: '/modules/dashboard/client/views/dashboard.client.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      });
  }
}());
