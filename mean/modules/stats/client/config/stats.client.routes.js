(function () {
  'use strict';

  angular
    .module('stats')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('stats', {
        abstract: true,
        url: '/stats',
        template: '<ui-view/>'
      })
      .state('stats.list', {
        url: '',
        templateUrl: 'modules/stats/client/views/list-stats.client.view.html',
        controller: 'StatsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Stats List'
        }
      })
      .state('stats.create', {
        url: '/create',
        templateUrl: 'modules/stats/client/views/form-stat.client.view.html',
        controller: 'StatsController',
        controllerAs: 'vm',
        resolve: {
          statResolve: newStat
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Stats Create'
        }
      })
      .state('stats.edit', {
        url: '/:statId/edit',
        templateUrl: 'modules/stats/client/views/form-stat.client.view.html',
        controller: 'StatsController',
        controllerAs: 'vm',
        resolve: {
          statResolve: getStat
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Stat {{ statResolve.name }}'
        }
      })
      .state('stats.view', {
        url: '/:statId',
        templateUrl: 'modules/stats/client/views/view-stat.client.view.html',
        controller: 'StatsController',
        controllerAs: 'vm',
        resolve: {
          statResolve: getStat
        },
        data: {
          pageTitle: 'Stat {{ statResolve.name }}'
        }
      });
  }

  getStat.$inject = ['$stateParams', 'StatsService'];

  function getStat($stateParams, StatsService) {
    return StatsService.get({
      statId: $stateParams.statId
    }).$promise;
  }

  newStat.$inject = ['StatsService'];

  function newStat(StatsService) {
    return new StatsService();
  }
}());
