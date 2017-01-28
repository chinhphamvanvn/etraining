(function () {
  'use strict';

  // Setting up route
  angular
    .module('performance.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('admin.workspace.performance', {
        url: '/performance',
        templateUrl: '/modules/performance/client/views/performance.client.view.html',
        controller: 'PerformanceController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      });
  }
}());
