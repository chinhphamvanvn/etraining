(function () {
  'use strict';

  // Setting up route
  angular
    .module('settings.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('admin.workspace.settings', {
        url: '/settings',
        abstract:true,
        template: '<ui-view/>',
        data: {
          roles: [ 'admin']
        }
      })
     .state('admin.workspace.settings.system', {
        url: '/system',
        templateUrl: '/modules/settings/client/views/settings-system.client.view.html',
        controller: 'SystemSettingsController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })
    .state('admin.workspace.settings.alert', {
        url: '/alert',
        templateUrl: '/modules/settings/client/views/alert.client.view.html',
        controller: 'AlertSettingsController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })  
      .state('admin.workspace.settings.annoucements', {
        abstract: true,
        url: '/annoucements',
        template: '<ui-view/>'
      })
      .state('admin.workspace.settings.annoucements.list', {
        url: '/list',
        templateUrl: '/modules/settings/client/views/list-annoucements.client.view.html',
        controller: 'AnnoucementListController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.settings.annoucements.new', {
        url: '/create',
        templateUrl: '/modules/settings/client/views/form-annoucement.client.view.html',
        controller: 'AnnoucementsController',
        controllerAs: 'vm',
        resolve:{
            annoucementResolve: newAnnoucement
        },
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.settings.annoucements.edit', {
        url: '/edit:/:annoucementId',
        templateUrl: '/modules/settings/client/views/form-annoucement.client.view.html',
        controller: 'AnnoucementsController',
        controllerAs: 'vm',
        resolve:{
            annoucementResolve: getAnnoucement
        },
        data: {
          roles: [ 'admin']
        }
      });
  }
  
  newAnnoucement.$inject = ['AnnoucementsService'];

  function newAnnoucement(AnnoucementsService) {
    return new AnnoucementsService();
  }
  
  getAnnoucement.$inject = ['$stateParams', 'AnnoucementsService'];

  function getAnnoucement($stateParams, AnnoucementsService) {
    return AnnoucementsService.get({
        annoucementId: $stateParams.annoucementId
    }).$promise;
  }
}());
