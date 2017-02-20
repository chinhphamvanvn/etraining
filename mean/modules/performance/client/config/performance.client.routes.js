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
        url: '/settings',
        abstract:true,
        template: '<ui-view/>',
        data: {
          roles: [ 'admin']
        }
      })
  }
}());
