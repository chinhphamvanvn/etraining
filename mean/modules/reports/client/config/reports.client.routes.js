(function () {
  'use strict';

  // Setting up route
  angular
    .module('reports.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('admin.workspace.reports', {
        url: '/reports',
        templateUrl: '/modules/reports/client/views/reports.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      });
  }
}());
