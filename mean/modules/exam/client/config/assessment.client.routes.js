(function () {
  'use strict';

  // Setting up route
  angular
    .module('assessment.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('admin.workspace.assessment', {
        url: '/assessment',
        templateUrl: '/modules/assessment/client/views/assessment.client.view.html',
        controller: 'AssessmentController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      });
  }
}());
